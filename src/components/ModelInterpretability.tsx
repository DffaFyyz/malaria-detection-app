import { BarChart3 } from "lucide-react";
import { edaSummary } from "../data/edaSummary";
import type { ModelId } from "../types/prediction";

type ModelInterpretabilityProps = {
  model: ModelId;
};

export function ModelInterpretability({ model }: ModelInterpretabilityProps) {
  if (model === "random_forest") {
    const maxImportance = Math.max(
      ...edaSummary.featureImportance.map((item) => item.importance),
    );

    return (
      <div>
        <div className="flex items-start gap-3">
          <BarChart3 className="mt-0.5 h-5 w-5 text-clinical-teal" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold">Random Forest Feature Importance</h2>
            <p className="mt-2 text-sm leading-6 text-clinical-muted">
              Tree-based importance estimates how much each feature contributes to split quality
              across the ensemble.
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {edaSummary.featureImportance.map((item) => (
            <div key={item.feature}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-clinical-ink">{item.feature}</span>
                <span className="text-sm font-semibold text-clinical-muted">
                  {(item.importance * 100).toFixed(2)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-clinical-teal"
                  style={{ width: `${(item.importance / maxImportance) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxCoefficient = Math.max(
    ...edaSummary.logisticCoefficients.map((item) => Math.abs(item.coefficient)),
  );

  return (
    <div>
      <div className="flex items-start gap-3">
        <BarChart3 className="mt-0.5 h-5 w-5 text-clinical-teal" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold">Logistic Regression Coefficient Importance</h2>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            Standardized coefficients show direction and strength. Positive values push the model
            toward Parasitized, while negative values push it toward Uninfected.
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {edaSummary.logisticCoefficients.map((item) => {
          const width = (Math.abs(item.coefficient) / maxCoefficient) * 100;
          const isPositive = item.coefficient >= 0;

          return (
            <div key={item.feature}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-clinical-ink">{item.feature}</span>
                <span
                  className={`text-sm font-semibold ${
                    isPositive ? "text-red-800" : "text-emerald-800"
                  }`}
                >
                  {item.coefficient.toFixed(4)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex h-2 justify-end rounded-l-full bg-slate-100">
                  {!isPositive ? (
                    <div
                      className="h-2 rounded-l-full bg-emerald-700"
                      style={{ width: `${width}%` }}
                    />
                  ) : null}
                </div>
                <div className="h-2 rounded-r-full bg-slate-100">
                  {isPositive ? (
                    <div
                      className="h-2 rounded-r-full bg-red-700"
                      style={{ width: `${width}%` }}
                    />
                  ) : null}
                </div>
              </div>
              <div className="mt-1 flex justify-between text-xs text-clinical-muted">
                <span>Uninfected direction</span>
                <span>Parasitized direction</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
