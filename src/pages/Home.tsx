import {
  Activity,
  ArrowRight,
  BarChart3,
  Database,
  FlaskConical,
  Microscope,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ResearchDisclaimer } from "../components/ResearchDisclaimer";
import { StatCard } from "../components/StatCard";
import { edaSummary } from "../data/edaSummary";
import { formatNumber } from "../lib/format";

type HomeProps = {
  onNavigate: (path: string) => void;
};

export function Home({ onNavigate }: HomeProps) {
  return (
    <div>
      <PageHeader
        eyebrow="Academic dashboard"
        title="Malaria Cell Classification Workbench"
        description="Upload microscopy cell images for model classification, then review confidence and extracted image features in a research-focused interface."
        action={
          <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
            Available models: {edaSummary.availableModels.length}
          </span>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          icon={<Database className="h-6 w-6" aria-hidden="true" />}
          label="Total Samples"
          value={formatNumber(edaSummary.dataset.totalSamples)}
          helper="Balanced microscopy image dataset"
        />
        <StatCard
          icon={<Microscope className="h-6 w-6" aria-hidden="true" />}
          label="Class Balance"
          value="50% / 50%"
          helper={`${formatNumber(edaSummary.dataset.uninfected)} uninfected and ${formatNumber(
            edaSummary.dataset.parasitized,
          )} parasitized`}
        />
        <StatCard
          icon={<FlaskConical className="h-6 w-6" aria-hidden="true" />}
          label="Selectable Models"
          value={String(edaSummary.availableModels.length)}
          helper="Random Forest and Logistic Regression"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-blue-50 text-clinical-blue">
              <Activity className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Run a Cell Image Prediction</h2>
              <p className="mt-2 leading-7 text-clinical-muted">
                Submit a microscopy image to the Flask `/predict` endpoint. The frontend sends the
                file as multipart form data using the required `image` field plus the selected
                `model`, then renders the classification, confidence, and feature vector.
              </p>
              <button
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-clinical-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                onClick={() => onNavigate("/predict")}
                type="button"
              >
                Open Predict Page
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-teal-50 text-clinical-teal">
              <BarChart3 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold">Review Research Insights</h2>
              <p className="mt-2 leading-7 text-clinical-muted">
                Explore dataset balance, feature definitions, model workflow, comparison metrics, and
                model-specific interpretability summaries used by the project.
              </p>
              <button
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-clinical-line px-4 py-3 text-sm font-semibold text-clinical-ink transition hover:bg-slate-100"
                onClick={() => onNavigate("/research")}
                type="button"
              >
                View Insights
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-8">
        <ResearchDisclaimer />
      </div>
    </div>
  );
}
