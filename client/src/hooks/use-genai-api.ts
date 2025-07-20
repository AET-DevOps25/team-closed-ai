import { useState, useCallback } from "react";
import {
  GenAIApi,
  Configuration,
  type PromptRequest,
  type GenAIResponse,
} from "@/api/genai";
import { type ApiState, createInitialApiState } from "../types/api";
import { useApi } from "./use-api";

const genAiApi = new GenAIApi(
  new Configuration({ basePath: import.meta.env.VITE_API_URL }),
);

interface GenAiApiHook {
  response: ApiState<GenAIResponse>;
  health: ApiState<string>;

  getHealth(): Promise<void>;
  createPrompt(data: PromptRequest): Promise<void>;

  clearErrors: () => void;
  resetState: () => void;
}

export const useGenAiApi = (): GenAiApiHook => {
  const { handleApiCall } = useApi();

  const [response, setResponse] = useState<ApiState<GenAIResponse>>(
    createInitialApiState,
  );
  const [health, setHealth] = useState<ApiState<string>>(createInitialApiState);

  const getHealth = useCallback(async () => {
    await handleApiCall(() => genAiApi.healthHealthzGet(), setHealth);
  }, [handleApiCall]);

  const createPrompt = useCallback(
    async (data: PromptRequest) => {
      await handleApiCall(
        () => genAiApi.interpretInterpretPost(data),
        setResponse,
      );
    },
    [handleApiCall],
  );

  const clearErrors = useCallback(() => {
    setResponse((prev) => ({ ...prev, error: null }));
    setHealth((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setResponse(createInitialApiState());
    setHealth(createInitialApiState());
  }, []);

  return {
    response,
    health,
    getHealth,
    createPrompt,
    clearErrors,
    resetState,
  };
};
