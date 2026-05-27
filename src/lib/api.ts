import type { ModelId, PredictionResponse } from "../types/prediction";
import type { MetadataResponse, ModelMetadata } from "../types/metadata";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function predictImage(image: File, model: ModelId): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("model", model);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload.error === "string"
        ? payload.error
        : "Prediction request failed. Check that the Flask API is running.";
    throw new Error(message);
  }

  return payload as PredictionResponse;
}

export async function fetchModelMetadata(): Promise<ModelMetadata> {
  const response = await fetch(`${API_BASE_URL}/metadata`);
  const payload = (await response.json().catch(() => null)) as MetadataResponse | null;

  if (!response.ok) {
    const message =
      payload && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "Metadata request failed. Check that the Flask API is running.";
    throw new Error(message);
  }

  if (!payload?.metadata) {
    throw new Error("Metadata response did not include a metadata object.");
  }

  return payload.metadata;
}
