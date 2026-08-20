import type { ApiError, PredictionRequest, PredictionResponse } from "../types/prediction";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class PredictionApiError extends Error {}

// locations.json is served as a static asset from the frontend's public/
// folder (copied there from the notebook's export), not from the backend.
export async function fetchLocations(): Promise<string[]> {
  const response = await fetch("/locations.json");
  if (!response.ok) {
    throw new PredictionApiError("Failed to load the locations list");
  }
  return response.json();
}

export async function predictPrice(
  payload: PredictionRequest
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Something went wrong while getting a prediction.";
    try {
      const errorBody: ApiError = await response.json();
      if (typeof errorBody.detail === "string") {
        message = errorBody.detail;
      } else if (Array.isArray(errorBody.detail)) {
        message = errorBody.detail.map((e) => e.msg).join(", ");
      }
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new PredictionApiError(message);
  }

  return response.json();
}