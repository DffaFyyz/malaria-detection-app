import { BrainCircuit, CheckCircle2 } from "lucide-react";
import { edaSummary } from "../data/edaSummary";
import { formatPercent } from "../lib/format";
import type { ModelId } from "../types/prediction";

type ModelSelectorProps = {
  selectedModel: ModelId;
  isLoading: boolean;
  onChange: (model: ModelId) => void;
};

export function ModelSelector({ selectedModel, isLoading, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      {edaSummary.availableModels.map((model) => {
        const metrics = edaSummary.modelComparison.find((item) => item.id === model.id);
        const isSelected = selectedModel === model.id;

        return (
          <button
            key={model.id}
            className={`w-full rounded-lg border p-4 text-left transition ${
              isSelected
                ? "border-clinical-blue bg-blue-50"
                : "border-clinical-line bg-white hover:bg-slate-50"
            }`}
            disabled={isLoading}
            onClick={() => onChange(model.id)}
            type="button"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg ${
                  isSelected ? "bg-white text-clinical-blue" : "bg-slate-100 text-clinical-muted"
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <BrainCircuit className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-clinical-ink">{model.name}</span>
                </span>
                <span className="mt-1 block text-sm leading-6 text-clinical-muted">
                  {model.description}
                </span>
                {metrics ? (
                  <span className="mt-3 grid gap-2 text-xs text-clinical-muted sm:grid-cols-3">
                    <span>Acc {formatPercent(metrics.accuracy)}</span>
                    <span>F1 {formatPercent(metrics.f1Parasitized)}</span>
                    <span>AUC {formatPercent(metrics.rocAuc)}</span>
                  </span>
                ) : null}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
