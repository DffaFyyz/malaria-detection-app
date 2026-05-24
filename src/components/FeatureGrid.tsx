import type { ExtractedFeatures } from "../types/prediction";
import { formatNumber } from "../lib/format";

type FeatureGridProps = {
  features: ExtractedFeatures;
};

const featureMeta = [
  {
    key: "cell_area",
    label: "Cell Area",
    helper: "Estimated segmented cell region",
  },
  {
    key: "parasite_count",
    label: "Parasite Count",
    helper: "Detected parasite-like regions",
  },
  {
    key: "parasite_area",
    label: "Parasite Area",
    helper: "Total parasite-region area",
  },
  {
    key: "texture_contrast",
    label: "Texture Contrast",
    helper: "GLCM contrast feature",
  },
] as const;

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {featureMeta.map((feature) => (
        <div key={feature.key} className="rounded-lg border border-clinical-line bg-slate-50 p-4">
          <p className="text-sm font-medium text-clinical-muted">{feature.label}</p>
          <p className="mt-2 text-2xl font-semibold text-clinical-ink">
            {formatNumber(features[feature.key])}
          </p>
          <p className="mt-2 text-sm text-clinical-muted">{feature.helper}</p>
        </div>
      ))}
    </div>
  );
}
