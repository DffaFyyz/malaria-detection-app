import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { edaSummary } from "../data/edaSummary";
import type { ModelId, PredictionResponse } from "../types/prediction";

type ResultCardProps = {
  result: PredictionResponse;
  selectedModel: ModelId;
};

export function ResultCard({ result, selectedModel }: ResultCardProps) {
  const isParasitized = result.prediction === "Parasitized";
  const Icon = isParasitized ? AlertTriangle : CheckCircle2;
  const selectedModelName =
    edaSummary.availableModels.find((model) => model.id === selectedModel)?.name ?? selectedModel;
  const responseModelName = result.model_name ?? result.model;
  const classProbabilities = result.class_probabilities;

  return (
    <div className="space-y-5">
      <div
        className={`rounded-lg border p-5 ${
          isParasitized
            ? "border-red-200 bg-red-50 text-red-900"
            : "border-emerald-200 bg-emerald-50 text-emerald-900"
        }`}
      >
        <div className="flex items-start gap-3">
          <Icon className="mt-1 h-6 w-6 flex-none" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Model classification result</p>
            <p className="mt-1 text-3xl font-semibold">{result.prediction}</p>
            <p className="mt-2 text-sm">
              Model: {responseModelName ? responseModelName : selectedModelName}
            </p>
          </div>
        </div>
      </div>
      <ConfidenceMeter value={result.confidence} />
      {classProbabilities ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(["Uninfected", "Parasitized"] as const).map((label) => {
            const probability = classProbabilities[label];

            return (
              <div key={label} className="rounded-lg border border-clinical-line bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-clinical-muted">{label}</span>
                  <span className="text-sm font-semibold text-clinical-ink">
                    {(probability * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div
                    className={`h-2 rounded-full ${
                      label === "Parasitized" ? "bg-red-700" : "bg-emerald-700"
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, probability * 100))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
