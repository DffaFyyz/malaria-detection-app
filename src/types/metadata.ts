export type ModelMetadata = {
  dataset: {
    totalSamples: number;
    uninfected: number;
    parasitized: number;
    missingValues: number;
    duplicateRows: number;
  };
  modelSupport: {
    note: string;
  };
  availableModels: {
    id: string;
    name: string;
    description: string;
    file: string;
    parameters?: Record<string, string | number>;
  }[];
  classDistribution: {
    name: string;
    value: number;
    fill: string;
  }[];
  modelComparison: {
    id: string;
    model: string;
    accuracy: number;
    precisionParasitized: number;
    recallParasitized: number;
    f1Parasitized: number;
    rocAuc: number;
    available: boolean;
  }[];
  featureExplanations: {
    name: string;
    key: string;
    description: string;
  }[];
  workflow: string[];
  featureImportance: {
    feature: string;
    importance: number;
  }[];
  logisticCoefficients: {
    feature: string;
    coefficient: number;
  }[];
  extractionPipeline: {
    step: string;
    detail: string;
    output: string;
  }[];
  extractionParameters: {
    name: string;
    value: string;
  }[];
  learningCurve: {
    scoring: string;
    cv: number;
    description: string;
    points: {
      model: string;
      trainingExamples: number;
      trainF1Mean: number;
      validationF1Mean: number;
    }[];
  };
};

export type MetadataResponse = {
  status: string;
  metadata: ModelMetadata;
};
