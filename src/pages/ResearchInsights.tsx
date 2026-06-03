import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, AlertCircle, BarChart3, Database, FlaskConical, Microscope } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { ResearchDisclaimer } from "../components/ResearchDisclaimer";
import { StatCard } from "../components/StatCard";
import { fetchModelMetadata } from "../lib/api";
import { formatNumber, formatPercent } from "../lib/format";
import type { ModelMetadata } from "../types/metadata";

function toPercentValue(value: number) {
  return Number((value * 100).toFixed(2));
}

export function ResearchInsights() {
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchModelMetadata()
      .then((nextMetadata) => {
        if (!isMounted) return;
        setMetadata(nextMetadata);
        setError(null);
      })
      .catch((caughtError) => {
        if (!isMounted) return;
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load model metadata.",
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const modelChartData = useMemo(
    () =>
      metadata?.modelComparison.map((model) => ({
        name: model.model,
        accuracy: toPercentValue(model.accuracy),
        f1: toPercentValue(model.f1Parasitized),
        rocAuc: toPercentValue(model.rocAuc),
      })) ?? [],
    [metadata],
  );

  const classDistributionData = metadata?.classDistribution.map((item) => ({ ...item })) ?? [];

  const importanceChartData =
    metadata?.featureImportance.map((item) => ({
      feature: item.feature,
      importance: toPercentValue(item.importance),
    })) ?? [];

  const coefficientChartData =
    metadata?.logisticCoefficients.map((item) => ({
      feature: item.feature,
      coefficient: Number(item.coefficient.toFixed(4)),
    })) ?? [];

  const learningCurveData = useMemo(() => {
    const rowsBySize = new Map<
      number,
      {
        trainingExamples: number;
        randomForestTrain?: number;
        randomForestValidation?: number;
        logisticRegressionTrain?: number;
        logisticRegressionValidation?: number;
      }
    >();

    for (const point of metadata?.learningCurve.points ?? []) {
      const row = rowsBySize.get(point.trainingExamples) ?? {
        trainingExamples: point.trainingExamples,
      };
      const isRandomForest = point.model === "Random Forest";

      if (isRandomForest) {
        row.randomForestTrain = toPercentValue(point.trainF1Mean);
        row.randomForestValidation = toPercentValue(point.validationF1Mean);
      } else {
        row.logisticRegressionTrain = toPercentValue(point.trainF1Mean);
        row.logisticRegressionValidation = toPercentValue(point.validationF1Mean);
      }

      rowsBySize.set(point.trainingExamples, row);
    }

    return Array.from(rowsBySize.values()).sort(
      (left, right) => left.trainingExamples - right.trainingExamples,
    );
  }, [metadata]);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          eyebrow="Research insights"
          title="Dataset, Features, and Model Evaluation"
          description="Loading model metadata from the Flask API."
        />
        <Panel className="p-6">
          <p className="text-sm font-semibold text-clinical-ink">Loading metadata...</p>
          <p className="mt-2 text-sm leading-6 text-clinical-muted">
            Requesting metadata from the Flask service.
          </p>
        </Panel>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div>
        <PageHeader
          eyebrow="Research insights"
          title="Dataset, Features, and Model Evaluation"
          description="Unable to load model metadata from the Flask API."
        />
        <Panel className="border-red-200 bg-red-50 p-6 text-red-900">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
            <div>
              <p className="font-semibold">Metadata request failed</p>
              <p className="mt-2 text-sm leading-6">
                {error ?? "The metadata response was empty."}
              </p>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

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
          value={formatNumber(metadata.dataset.totalSamples)}
          helper="Thin blood smear cell images"
        />
        <StatCard
          icon={<Microscope className="h-6 w-6" aria-hidden="true" />}
          label="Uninfected"
          value={formatNumber(metadata.dataset.uninfected)}
          helper={`Class share: ${formatPercent(
            metadata.dataset.uninfected / metadata.dataset.totalSamples,
          )}`}
        />
        <StatCard
          icon={<Activity className="h-6 w-6" aria-hidden="true" />}
          label="Parasitized"
          value={formatNumber(metadata.dataset.parasitized)}
          helper={`Class share: ${formatPercent(
            metadata.dataset.parasitized / metadata.dataset.totalSamples,
          )}`}
        />
        <StatCard
          icon={<BarChart3 className="h-6 w-6" aria-hidden="true" />}
          label="Data Quality Flags"
          value={`${metadata.dataset.missingValues} / ${metadata.dataset.duplicateRows}`}
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
              <p>{metadata.modelSupport.note}</p>
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
                  {metadata.classDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {metadata.classDistribution.map((item) => (
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-lg font-semibold">Why Malaria Cell Classification Matters</h2>
          <span className="inline-flex w-fit flex-none rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
            For academic research and educational use only
          </span>
        </div>

        <div className="mt-5 grid gap-5 text-sm leading-7 text-clinical-muted lg:grid-cols-2">
          <p>
            Malaria remains one of the major global health problems, especially in tropical and
            low-resource regions. According to the World Health Organization, there were an
            estimated 282 million malaria cases and 610,000 malaria deaths worldwide in 2024. Most
            of this burden occurred in the WHO African Region, which accounted for about 95% of
            global malaria cases and deaths. Children under five years old are among the most
            vulnerable groups affected by the disease.
          </p>
          <p>
            Early and accurate diagnosis is important because malaria can progress from mild
            symptoms into severe illness if it is not treated properly. Laboratory confirmation is
            still required for malaria diagnosis, and microscopic examination of stained blood
            smears remains a gold standard method for identifying malaria parasites. However, this
            process depends on the quality of the microscope, blood smear preparation, staining, and
            the experience of the laboratory personnel.
          </p>
          <p>
            This project explores how image processing and machine learning can support malaria
            cell classification by analyzing thin blood smear cell images. Instead of relying only
            on manual observation, the system extracts measurable visual features from each cell
            image, such as cell area, parasite-like region count, parasite area, and texture
            contrast. These features are then used by classical machine learning models to classify
            whether a cell is Parasitized or Uninfected.
          </p>
          <p>
            The goal of this application is not to replace medical diagnosis, but to demonstrate how
            computational methods can assist image-based disease analysis. By converting microscopic
            cell images into structured numerical features, the system helps make the
            classification process more consistent, explainable, and easier to evaluate. This makes
            the project useful for academic research, model comparison, and understanding how visual
            patterns in infected blood cells can be translated into machine-learning features.
          </p>
        </div>
      </Panel>

      <Panel className="mt-8 p-6">
        <h2 className="text-lg font-semibold">Feature Explanations</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metadata.featureExplanations.map((feature) => (
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
            {metadata.workflow.map((step, index) => (
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
              {metadata.modelComparison.map((model) => (
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
            {metadata.learningCurve.scoring} score / {metadata.learningCurve.cv}-fold CV
          </span>
        </div>
        <div className="mt-5 h-96 rounded-lg border border-clinical-line bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningCurveData} margin={{ left: 8, right: 20, top: 10 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
              <XAxis
                dataKey="trainingExamples"
                tickFormatter={(value: number) => formatNumber(value)}
              />
              <YAxis domain={[90, 101]} tickFormatter={(value: number) => `${value}%`} />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}%`}
                labelFormatter={(value: number) => `${formatNumber(value)} training examples`}
              />
              <Legend />
              <Line
                dataKey="randomForestTrain"
                name="RF Train F1"
                stroke="#2563EB"
                strokeDasharray="6 4"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="randomForestValidation"
                name="RF Validation F1"
                stroke="#2563EB"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="logisticRegressionTrain"
                name="LR Train F1"
                stroke="#0F766E"
                strokeDasharray="6 4"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="logisticRegressionValidation"
                name="LR Validation F1"
                stroke="#0F766E"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mt-8">
        <ResearchDisclaimer />
      </div>
    </div>
  );
}
