import type { ModelId, PredictionResponse } from "../types/prediction";

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
