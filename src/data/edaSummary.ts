export const edaSummary = {
  dataset: {
    totalSamples: 27358,
    uninfected: 13679,
    parasitized: 13679,
    missingValues: 0,
    duplicateRows: 0,
  },
  modelSupport: {
    note: "The Flask API supports both Random Forest and Logistic Regression for live prediction.",
  },
  availableModels: [
    {
      id: "random_forest",
      name: "Random Forest",
      description: "Tree ensemble classifier using extracted morphology and texture features.",
      file: "malaria_rf_model.pkl",
    },
    {
      id: "logistic_regression",
      name: "Logistic Regression",
      description: "Linear baseline pipeline with slightly stronger summary metrics in evaluation.",
      file: "malaria_logistic_regression_model.pkl",
    },
  ],
  classDistribution: [
    { name: "Uninfected", value: 13679, fill: "#047857" },
    { name: "Parasitized", value: 13679, fill: "#B91C1C" },
  ],
  modelComparison: [
    {
      id: "random_forest",
      model: "Random Forest",
      accuracy: 0.9413,
      f1Parasitized: 0.9399,
      rocAuc: 0.9631,
      available: true,
    },
    {
      id: "logistic_regression",
      model: "Logistic Regression",
      accuracy: 0.9452,
      f1Parasitized: 0.9439,
      rocAuc: 0.9666,
      available: true,
    },
  ],
  featureExplanations: [
    {
      name: "Cell Area",
      key: "cell_area",
      description: "Estimated segmented red blood cell area from the microscopy image.",
    },
    {
      name: "Parasite Count",
      key: "parasite_count",
      description: "Count of detected parasite-like regions after image segmentation.",
    },
    {
      name: "Parasite Area",
      key: "parasite_area",
      description: "Total area covered by detected parasite-like regions.",
    },
    {
      name: "Texture Contrast",
      key: "texture_contrast",
      description: "Gray-level co-occurrence contrast feature describing local texture variation.",
    },
  ],
  workflow: [
    "Upload a thin blood smear cell image",
    "Decode and validate the image in the Flask API",
    "Extract area, parasite-region, and texture features",
    "Run the selected classifier",
    "Return prediction, confidence, and extracted features",
  ],
  featureImportance: [
    { feature: "Parasite Area", importance: 0.428605 },
    { feature: "Parasite Count", importance: 0.391749 },
    { feature: "Cell Area", importance: 0.091484 },
    { feature: "Texture Contrast", importance: 0.088162 },
  ],
  logisticCoefficients: [
    { feature: "Parasite Count", coefficient: 3.240071 },
    { feature: "Parasite Area", coefficient: 0.977813 },
    { feature: "Cell Area", coefficient: -0.590341 },
    { feature: "Texture Contrast", coefficient: -0.113462 },
  ],
  extractionPipeline: [
    {
      step: "Decode Image",
      detail: "Read uploaded image bytes and decode them as a BGR image with OpenCV.",
      output: "img_bgr",
    },
    {
      step: "Cell Masking",
      detail:
        "Convert to grayscale, apply Gaussian blur, then use Otsu thresholding to separate the cell region.",
      output: "mask_cell",
    },
    {
      step: "Parasite Candidate Masking",
      detail:
        "Convert BGR to HSV and use the saturation channel inside the cell mask to find parasite-like regions.",
      output: "mask_parasite_final",
    },
    {
      step: "Contour Filtering",
      detail:
        "Measure cell contours above 500 px and parasite contours above 25 px to remove small noise regions.",
      output: "contours",
    },
    {
      step: "Texture Extraction",
      detail:
        "Crop the largest cell region and compute GLCM contrast with distance 1 and angle 0 degrees.",
      output: "texture_contrast",
    },
  ],
  extractionParameters: [
    { name: "Cell contour minimum area", value: "> 500 px" },
    { name: "Parasite contour minimum area", value: "> 25 px" },
    { name: "Parasite threshold", value: "mean(S) + 3 * std(S) + 10" },
    { name: "GLCM distance", value: "1 px" },
    { name: "GLCM angle", value: "0 degrees" },
  ],
} as const;
