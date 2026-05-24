import { AlertCircle, FlaskConical } from "lucide-react";
import { useEffect, useState } from "react";
import { FeatureGrid } from "../components/FeatureGrid";
import { ModelSelector } from "../components/ModelSelector";
import { ModelInterpretability } from "../components/ModelInterpretability";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ResearchDisclaimer } from "../components/ResearchDisclaimer";
import { ResultCard } from "../components/ResultCard";
import { UploadPanel } from "../components/UploadPanel";
import { edaSummary } from "../data/edaSummary";
import { predictImage } from "../lib/api";
import type { ModelId, PredictionResponse } from "../types/prediction";

export function Predict() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelId>("random_forest");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedModelName =
    edaSummary.availableModels.find((model) => model.id === selectedModel)?.name ?? "Model";

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function handleFileChange(nextFile: File) {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(nextFile);
    setImageUrl(URL.createObjectURL(nextFile));
    setResult(null);
    setError(null);
  }

  function handleReset() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
  }

  function handleModelChange(model: ModelId) {
    setSelectedModel(model);
    setResult(null);
    setError(null);
  }

  async function handleAnalyze() {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictImage(file, selectedModel);
      setResult(response);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to complete prediction request.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Live prediction"
        title="Classify a Cell Image"
        description="Upload a microscopy image, choose a classifier, and submit it to the Flask prediction API."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            Selected: {selectedModelName}
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Image Upload</h2>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            The request is sent as multipart form data with `image` and `model` fields.
          </p>
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-clinical-ink">Model Selection</h3>
            <ModelSelector
              isLoading={isLoading}
              onChange={handleModelChange}
              selectedModel={selectedModel}
            />
          </div>
          <div className="mt-5">
            <UploadPanel
              file={file}
              imageUrl={imageUrl}
              isLoading={isLoading}
              onAnalyze={handleAnalyze}
              onFileChange={handleFileChange}
              onReset={handleReset}
            />
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-6">
            <h2 className="text-lg font-semibold">Prediction Result</h2>
            <div className="mt-5">
              {isLoading ? (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 text-blue-900">
                  <p className="font-semibold">Analyzing image...</p>
                  <p className="mt-2 text-sm leading-6">
                    Extracting image features and running the selected {selectedModelName} classifier.
                  </p>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">Prediction failed</p>
                      <p className="mt-2 text-sm leading-6">{error}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {result ? <ResultCard result={result} selectedModel={selectedModel} /> : null}

              {!isLoading && !error && !result ? (
                <div className="rounded-lg border border-clinical-line bg-slate-50 p-6 text-center">
                  <p className="font-semibold text-clinical-ink">No result yet</p>
                  <p className="mt-2 text-sm leading-6 text-clinical-muted">
                    Select an image and run analysis to see the model output.
                  </p>
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-lg font-semibold">Extracted Features</h2>
            <p className="mt-2 text-sm leading-6 text-clinical-muted">
              Feature values returned by the image-processing pipeline.
            </p>
            <div className="mt-5">
              {result ? (
                <FeatureGrid features={result.extracted_features} />
              ) : (
                <div className="rounded-lg border border-clinical-line bg-slate-50 p-6 text-sm text-clinical-muted">
                  Feature values will appear after a successful prediction.
                </div>
              )}
            </div>
          </Panel>

          <Panel className="p-6">
            <ModelInterpretability model={selectedModel} />
          </Panel>

          <ResearchDisclaimer compact />
        </div>
      </div>
    </div>
  );
}
