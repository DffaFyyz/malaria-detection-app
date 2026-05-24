export type PredictionLabel = "Parasitized" | "Uninfected";

export type ModelId = "random_forest" | "logistic_regression";

export type ExtractedFeatures = {
  cell_area: number;
  parasite_count: number;
  parasite_area: number;
  texture_contrast: number;
};

export type PredictionResponse = {
  status: string;
  prediction: PredictionLabel;
  confidence: number;
  model?: ModelId | string;
  model_name?: string;
  class_probabilities?: Record<PredictionLabel, number>;
  extracted_features: ExtractedFeatures;
};
