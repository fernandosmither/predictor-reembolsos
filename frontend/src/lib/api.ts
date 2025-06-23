import type { PredictionRequest, PredictionResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class PredictionApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        response
      );
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/`);
    if (!response.ok) {
      throw new ApiError('Health check failed', response.status, response);
    }
    return response.json();
  }
}

// Export singleton instance
export const api = new PredictionApi(); 