import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, Database, FlaskConical, Microscope } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ResearchDisclaimer } from "../components/ResearchDisclaimer";
import { StatCard } from "../components/StatCard";
import { edaSummary } from "../data/edaSummary";
import { formatNumber, formatPercent } from "../lib/format";

const modelChartData = edaSummary.modelComparison.map((model) => ({
  name: model.model,
  accuracy: Number((model.accuracy * 100).toFixed(2)),
  f1: Number((model.f1Parasitized * 100).toFixed(2)),
  rocAuc: Number((model.rocAuc * 100).toFixed(2)),
}));

const classDistributionData = edaSummary.classDistribution.map((item) => ({ ...item }));

const importanceChartData = edaSummary.featureImportance.map((item) => ({
  feature: item.feature,
  importance: Number((item.importance * 100).toFixed(2)),
}));

const coefficientChartData = edaSummary.logisticCoefficients.map((item) => ({
  feature: item.feature,
  coefficient: Number(item.coefficient.toFixed(4)),
}));

export function ResearchInsights() {
  return (
    <div>
      <PageHeader
        eyebrow="Research insights"
        title="Dataset, Features, and Model Evaluation"
        description="A compact overview of the project data, extracted features, model workflow, and comparison metrics used to frame the live prediction interface."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Database className="h-6 w-6" aria-hidden="true" />}
          label="Total Samples"
          value={formatNumber(edaSummary.dataset.totalSamples)}
          helper="Thin blood smear cell images"
        />
        <StatCard
          icon={<Microscope className="h-6 w-6" aria-hidden="true" />}
          label="Uninfected"
          value={formatNumber(edaSummary.dataset.uninfected)}
          helper="Class share: 50%"
        />
        <StatCard
          icon={<Activity className="h-6 w-6" aria-hidden="true" />}
          label="Parasitized"
          value={formatNumber(edaSummary.dataset.parasitized)}
          helper="Class share: 50%"
        />
        <StatCard
          icon={<BarChart3 className="h-6 w-6" aria-hidden="true" />}
          label="Data Quality Flags"
          value={`${edaSummary.dataset.missingValues} / ${edaSummary.dataset.duplicateRows}`}
          helper="Missing values / duplicate rows"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel className="p-6">
          <h2 className="text-lg font-semibold">About the Project</h2>
          <p className="mt-3 leading-7 text-clinical-muted">
            This application supports academic exploration of malaria cell classification using
            handcrafted image features and classical machine-learning models. The live API returns a
            binary classification, model confidence, selected model metadata, class probabilities,
            and the four extracted features used by the classifier.
          </p>
          <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900">
            <div className="flex gap-3">
              <FlaskConical className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <p>{edaSummary.modelSupport.note}</p>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Class Distribution</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classDistributionData}
                  dataKey="value"
                  innerRadius={64}
                  nameKey="name"
                  outerRadius={96}
                  paddingAngle={2}
                >
                  {edaSummary.classDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {edaSummary.classDistribution.map((item) => (
              <div key={item.name} className="rounded-lg border border-clinical-line bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <p className="mt-2 text-xl font-semibold">{formatNumber(item.value)}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-8 p-6">
        <h2 className="text-lg font-semibold">Feature Explanations</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {edaSummary.featureExplanations.map((feature) => (
            <div key={feature.key} className="rounded-lg border border-clinical-line bg-slate-50 p-4">
              <p className="text-base font-semibold">{feature.name}</p>
              <p className="mt-2 text-sm leading-6 text-clinical-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Model Workflow</h2>
          <ol className="mt-5 space-y-4">
            {edaSummary.workflow.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-clinical-blue">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-clinical-muted">{step}</p>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Random Forest Feature Importance</h2>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            Tree-based importance shows relative contribution strength.
          </p>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceChartData} layout="vertical" margin={{ left: 28 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
                <XAxis type="number" unit="%" />
                <YAxis dataKey="feature" type="category" width={120} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Bar dataKey="importance" fill="#0F766E" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-6">
          <h2 className="text-lg font-semibold">Logistic Regression Coefficients</h2>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            Positive coefficients point toward Parasitized; negative coefficients point toward
            Uninfected.
          </p>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coefficientChartData} layout="vertical" margin={{ left: 28 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
                <XAxis type="number" domain={[-3.5, 3.5]} />
                <YAxis dataKey="feature" type="category" width={120} />
                <Tooltip formatter={(value: number) => value.toFixed(4)} />
                <Bar dataKey="coefficient" radius={[0, 6, 6, 0]}>
                  {coefficientChartData.map((entry) => (
                    <Cell
                      key={entry.feature}
                      fill={entry.coefficient >= 0 ? "#B91C1C" : "#047857"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="mt-8 overflow-hidden">
        <div className="border-b border-clinical-line p-6">
          <h2 className="text-lg font-semibold">Model Comparison</h2>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            Both models are available in the live Flask API and can be selected from the Predict page.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-clinical-line text-sm">
            <thead className="bg-slate-50 text-left text-clinical-muted">
              <tr>
                <th className="px-6 py-3 font-semibold">Model</th>
                <th className="px-6 py-3 font-semibold">Accuracy</th>
                <th className="px-6 py-3 font-semibold">F1 Parasitized</th>
                <th className="px-6 py-3 font-semibold">ROC-AUC</th>
                <th className="px-6 py-3 font-semibold">API Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinical-line bg-white">
              {edaSummary.modelComparison.map((model) => (
                <tr key={model.model}>
                  <td className="px-6 py-4 font-medium text-clinical-ink">{model.model}</td>
                  <td className="px-6 py-4">{formatPercent(model.accuracy)}</td>
                  <td className="px-6 py-4">{formatPercent(model.f1Parasitized)}</td>
                  <td className="px-6 py-4">{formatPercent(model.rocAuc)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        model.available
                          ? "bg-blue-50 text-blue-800"
                          : "bg-slate-100 text-clinical-muted"
                      }`}
                    >
                      Selectable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-clinical-line p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelChartData}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis domain={[90, 100]} unit="%" />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Bar dataKey="accuracy" name="Accuracy" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="f1" name="F1 Parasitized" fill="#0F766E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rocAuc" name="ROC-AUC" fill="#64748B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>

      <Panel className="mt-8 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Learning Curve</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-clinical-muted">
              Training and validation F1 scores across increasing sample sizes for Random Forest
              and Logistic Regression. The chart helps show whether model performance remains
              stable as more training examples are used.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-clinical-line bg-slate-50 px-3 py-1 text-xs font-semibold text-clinical-muted">
            F1 score
          </span>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-clinical-line bg-white">
          <img
            alt="Learning curve comparing Random Forest and Logistic Regression training and validation F1 scores"
            className="w-full object-contain"
            src="/research/learning_curve.png"
          />
        </div>
      </Panel>

      <div className="mt-8">
        <ResearchDisclaimer />
      </div>
    </div>
  );
}
