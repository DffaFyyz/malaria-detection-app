import {
  ArrowRight,
  Binary,
  Braces,
  CircleDot,
  Layers3,
  Microscope,
  SlidersHorizontal,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ResearchDisclaimer } from "../components/ResearchDisclaimer";
import { edaSummary } from "../data/edaSummary";

const featureDetails = [
  {
    name: "cell_area",
    title: "Cell Area",
    source: "Cell contours from the binary cell mask",
    calculation: "Sum contour areas where contour area is greater than 500 pixels.",
    meaning: "Approximates the visible red blood cell region in the image.",
  },
  {
    name: "parasite_count",
    title: "Parasite Count",
    source: "Parasite candidate contours from the saturation-channel mask",
    calculation: "Count parasite contours where contour area is greater than 25 pixels.",
    meaning: "Counts detected parasite-like regions after noise filtering.",
  },
  {
    name: "parasite_area",
    title: "Parasite Area",
    source: "Parasite candidate contours from the saturation-channel mask",
    calculation: "Sum contour areas of parasite-like regions above 25 pixels.",
    meaning: "Measures total estimated parasite-region coverage.",
  },
  {
    name: "texture_contrast",
    title: "Texture Contrast",
    source: "GLCM computed from the largest cell crop",
    calculation: "graycoprops(GLCM, contrast) using distance 1, angle 0, 256 gray levels.",
    meaning: "Captures local grayscale texture variation inside the cell region.",
  },
];

const limitations = [
  "Handcrafted thresholds can be sensitive to staining, brightness, and image quality.",
  "Parasite-like regions are detected from saturation patterns, so artifacts can affect the mask.",
  "Contour filtering removes small noise but may also ignore very small relevant regions.",
  "The extracted values support research classification and are not clinical diagnostic measurements.",
];

export function FeatureExtraction() {
  return (
    <div>
      <PageHeader
        eyebrow="Methodology"
        title="Feature Extraction Pipeline"
        description="How each uploaded cell image is transformed into the four numerical features used by the Random Forest and Logistic Regression classifiers."
        action={
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
            4-feature input vector
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel className="p-6">
          <div className="flex items-start gap-3">
            <Microscope className="mt-0.5 h-5 w-5 text-clinical-blue" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold">Computer Vision Approach</h2>
              <p className="mt-3 leading-7 text-clinical-muted">
                The project uses a classical image-processing pipeline before classification. The
                image is segmented into cell and parasite-candidate masks, contours are measured,
                and a texture descriptor is computed from the largest cell region.
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="flex items-start gap-3">
            <Braces className="mt-0.5 h-5 w-5 text-clinical-teal" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold">Model Input Vector</h2>
              <p className="mt-3 leading-7 text-clinical-muted">
                The backend creates a DataFrame with the same column order used during training:
              </p>
              <div className="mt-4 rounded-lg border border-clinical-line bg-slate-50 p-4 font-mono text-sm text-clinical-ink">
                [cell_area, parasite_count, parasite_area, texture_contrast]
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="mt-8 p-6">
        <h2 className="text-lg font-semibold">Pipeline Steps</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {edaSummary.extractionPipeline.map((item, index) => (
            <div key={item.step} className="rounded-lg border border-clinical-line bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-clinical-blue">
                  {index + 1}
                </span>
                <h3 className="text-sm font-semibold text-clinical-ink">{item.step}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-clinical-muted">{item.detail}</p>
              <div className="mt-4 rounded-md bg-white px-3 py-2 font-mono text-xs text-clinical-muted">
                {item.output}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Preprocessing Visualization</h2>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            The notebook visualizes the image transformation from the original cell image into a
            binary cell mask, saturation-channel view, and final parasite-candidate mask.
          </p>
          <div className="mt-5 overflow-hidden rounded-lg border border-clinical-line bg-white">
            <img
              alt="Preprocessing visualization showing original cell image, cell mask, saturation channel, and final parasite mask"
              className="w-full object-contain"
              src="/research/preprocessing_visualization.png"
            />
          </div>
        </Panel>

        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Final Feature Detection</h2>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            The final extraction view shows the cleaned parasite mask and the detected regions
            overlaid on the original cell image.
          </p>
          <div className="mt-5 overflow-hidden rounded-lg border border-clinical-line bg-white">
            <img
              alt="Final extraction visualization showing cleaned parasite mask and detected feature overlay"
              className="w-full object-contain"
              src="/research/final_extraction.png"
            />
          </div>
        </Panel>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Feature Definitions</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {featureDetails.map((feature) => (
              <div key={feature.name} className="rounded-lg border border-clinical-line bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <CircleDot className="mt-1 h-4 w-4 flex-none text-clinical-teal" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 font-mono text-xs text-clinical-muted">{feature.name}</p>
                  </div>
                </div>
                <dl className="mt-4 space-y-3 text-sm leading-6">
                  <div>
                    <dt className="font-semibold text-clinical-ink">Source</dt>
                    <dd className="text-clinical-muted">{feature.source}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-clinical-ink">Calculation</dt>
                    <dd className="text-clinical-muted">{feature.calculation}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-clinical-ink">Meaning</dt>
                    <dd className="text-clinical-muted">{feature.meaning}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-6">
            <div className="flex items-start gap-3">
              <SlidersHorizontal className="mt-0.5 h-5 w-5 text-clinical-blue" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold">Extraction Parameters</h2>
                <p className="mt-2 text-sm leading-6 text-clinical-muted">
                  Key thresholds and settings used by the feature extraction code.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {edaSummary.extractionParameters.map((parameter) => (
                <div
                  key={parameter.name}
                  className="flex items-center justify-between gap-4 rounded-lg border border-clinical-line bg-slate-50 p-3"
                >
                  <span className="text-sm text-clinical-muted">{parameter.name}</span>
                  <span className="text-right font-mono text-sm font-semibold text-clinical-ink">
                    {parameter.value}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-start gap-3">
              <Layers3 className="mt-0.5 h-5 w-5 text-clinical-teal" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold">How Features Reach the Models</h2>
                <p className="mt-3 text-sm leading-6 text-clinical-muted">
                  The four extracted values are passed to the selected classifier as a single-row
                  feature table. Both models use the same feature order, so predictions stay
                  comparable across Random Forest and Logistic Regression.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-clinical-line bg-slate-50 p-4 text-sm text-clinical-muted">
              <Binary className="h-5 w-5 flex-none text-clinical-blue" aria-hidden="true" />
              <span>Image</span>
              <ArrowRight className="h-4 w-4 flex-none" aria-hidden="true" />
              <span>Features</span>
              <ArrowRight className="h-4 w-4 flex-none" aria-hidden="true" />
              <span>Classifier</span>
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="mt-8 p-6">
        <h2 className="text-lg font-semibold">Method Limitations</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {limitations.map((item) => (
            <div key={item} className="rounded-lg border border-clinical-line bg-slate-50 p-4 text-sm leading-6 text-clinical-muted">
              {item}
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-8">
        <ResearchDisclaimer />
      </div>
    </div>
  );
}
