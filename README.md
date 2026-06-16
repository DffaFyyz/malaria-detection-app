# Malaria Cell Classification Frontend

Research-focused web interface for malaria cell classification from thin blood smear cell images. The app lets users upload a microscopy image, choose a classical machine-learning model, send the image to a Flask prediction API, and review the predicted class, confidence, class probabilities, and extracted image features.

This project is intended for academic research and educational use only. It is not a certified medical diagnostic system and should not be used as the sole basis for clinical decisions.

## Features

- Upload a cell microscopy image and preview it before analysis.
- Select either Random Forest or Logistic Regression for prediction.
- Send multipart prediction requests to the Flask API.
- Display prediction label, confidence, probabilities, and extracted feature values.
- Explain the image-processing pipeline used to generate model features.
- Show research insights, dataset balance, feature definitions, model comparison metrics, feature importance, coefficients, and learning-curve trends.
- Present a clear academic-use disclaimer throughout the interface.

## Tech Stack

- React 19 for the frontend UI.
- TypeScript for typed components, API responses, and model metadata contracts.
- Vite for development and production builds.
- Tailwind CSS for styling.
- Recharts for charts and research visualizations.
- Lucide React for interface icons.
- Flask API backend expected at runtime for prediction and metadata endpoints.

## Application Pages

- `Home` (`/`): overview dashboard with dataset and model summary.
- `Predict` (`/predict`): image upload, model selection, API submission, result display, extracted features, and model interpretation.
- `Research Insights` (`/research`): dataset statistics, project context, malaria classification motivation, feature explanations, workflow, model metrics, feature importance, coefficients, and learning curves.
- `Feature Extraction` (`/features`): detailed explanation of the computer-vision pipeline and the four model input features.

## Model Summary

The frontend supports two selectable classifiers exposed by the Flask API:

| Model ID | Model Name | Description | Expected Model File |
| --- | --- | --- | --- |
| `random_forest` | Random Forest | Tree ensemble classifier using extracted morphology and texture features. | `malaria_rf_model.pkl` |
| `logistic_regression` | Logistic Regression | Linear baseline pipeline using the same extracted feature vector. | `malaria_logistic_regression_model.pkl` |

Both models classify a cell image as either:

- `Parasitized`
- `Uninfected`

## Feature Vector

The backend extracts four numerical features from each uploaded image and passes them to the selected classifier in this order:

```txt
[cell_area, parasite_count, parasite_area, texture_contrast]
```

Feature meanings:

- `cell_area`: estimated segmented red blood cell area from the microscopy image.
- `parasite_count`: count of detected parasite-like regions after segmentation.
- `parasite_area`: total area covered by detected parasite-like regions.
- `texture_contrast`: gray-level co-occurrence matrix contrast describing local texture variation.

The app documents these steps in the Feature Extraction page:

1. Decode uploaded image bytes.
2. Segment the cell region with grayscale preprocessing and thresholding.
3. Detect parasite-candidate regions using saturation-channel masking.
4. Filter contours by minimum area thresholds.
5. Compute texture contrast from the largest cell crop.

## Dataset and Reported Metrics

The frontend research summary uses the following dataset metadata:

- Total samples: `27,358`
- Uninfected samples: `13,679`
- Parasitized samples: `13,679`
- Missing values: `0`
- Duplicate rows: `0`

Reported model comparison:

| Model | Accuracy | F1 Parasitized | ROC-AUC |
| --- | ---: | ---: | ---: |
| Random Forest | 94.13% | 93.99% | 96.31% |
| Logistic Regression | 94.52% | 94.39% | 96.66% |

These values are displayed for research comparison and should be interpreted in the context of the dataset and feature-extraction pipeline.

## API Contract

By default, the frontend calls `/api`, which Vite proxies to the Flask backend during local development.

### Environment Variables

- `VITE_FLASK_API_TARGET`: target Flask API URL for the Vite dev proxy. Defaults to `http://localhost:5000`.
- `VITE_API_BASE_URL`: frontend API base URL used by fetch calls. Defaults to `/api`.

### `POST /predict`

Request type: `multipart/form-data`

Required fields:

- `image`: uploaded image file.
- `model`: model ID, either `random_forest` or `logistic_regression`.

Expected response shape:

```ts
{
  status: string;
  prediction: "Parasitized" | "Uninfected";
  confidence: number;
  model?: string;
  model_name?: string;
  class_probabilities?: {
    Parasitized: number;
    Uninfected: number;
  };
  extracted_features: {
    cell_area: number;
    parasite_count: number;
    parasite_area: number;
    texture_contrast: number;
  };
}
```

### `GET /metadata`

Returns model and research metadata used by the Research Insights page.

Expected top-level response shape:

```ts
{
  status: string;
  metadata: ModelMetadata;
}
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Running Flask backend with compatible `/predict` and `/metadata` endpoints

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The Vite server binds to `0.0.0.0` and usually serves the app at:

```txt
http://localhost:5173/
```

If port `5173` is already in use, Vite will choose another available port.

### Configure Backend Target

Create a local `.env` file if the Flask API is not running at `http://localhost:5000`:

```env
VITE_FLASK_API_TARGET=http://localhost:5000
```

For deployments where the API is hosted separately, configure:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

## Available Scripts

```bash
npm run dev
```

Start the Vite development server.

```bash
npm run build
```

Run TypeScript project build and create a production Vite bundle.

```bash
npm run preview
```

Preview the production build locally.

## Project Structure

```txt
src/
  components/          Reusable UI components
  data/                Static research summary data
  lib/                 API and formatting helpers
  pages/               Main route-level views
  types/               TypeScript API and metadata types
public/
  research/            Research images used by the Feature Extraction page
```

Important files:

- `src/lib/api.ts`: fetch wrappers for prediction and metadata requests.
- `src/types/prediction.ts`: prediction response and model ID types.
- `src/types/metadata.ts`: research metadata contract.
- `src/data/edaSummary.ts`: static dataset, model, feature, and pipeline summaries.
- `src/pages/Predict.tsx`: live prediction workflow.
- `src/pages/ResearchInsights.tsx`: research dashboard and model evaluation content.
- `src/pages/FeatureExtraction.tsx`: feature extraction methodology.
- `vite.config.ts`: Vite React setup and local `/api` proxy.
- `vercel.json`: SPA rewrite configuration for client-side routes.

## Deployment Notes

The project is configured as a single-page app. `vercel.json` rewrites all routes to `index.html`, allowing `/predict`, `/research`, and `/features` to work after refresh in production.

When deploying, make sure the frontend can reach a compatible backend API and set `VITE_API_BASE_URL` if `/api` is not served from the same origin.

## Research and Safety Note

This application demonstrates how image processing and machine learning can support image-based disease analysis by converting microscopy images into structured numerical features. It is designed for academic research, education, model comparison, and methodology explanation. It does not replace laboratory confirmation, professional medical interpretation, or clinical diagnosis.
