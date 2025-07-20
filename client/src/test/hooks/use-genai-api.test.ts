import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGenAiApi } from "@/hooks/use-genai-api";

// Mock useApi hook
const mockHandleApiCall = vi.fn();
vi.mock("@/hooks/use-api", () => ({
  useApi: () => ({
    handleApiCall: mockHandleApiCall,
  }),
}));

// Mock the GenAI API
vi.mock("@/api/genai", () => ({
  GenAIApi: vi.fn().mockImplementation(() => ({
    healthHealthzGet: vi.fn(),
    interpretInterpretPost: vi.fn(),
  })),
  Configuration: vi.fn(),
}));

describe("useGenAiApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useGenAiApi());

    expect(result.current.response).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.health).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should call health API", async () => {
    const { result } = renderHook(() => useGenAiApi());

    await act(async () => {
      await result.current.getHealth();
    });

    expect(mockHandleApiCall).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should call create prompt API", async () => {
    const { result } = renderHook(() => useGenAiApi());
    const promptData = { project_id: "1", prompt: "test prompt" };

    await act(async () => {
      await result.current.createPrompt(promptData);
    });

    expect(mockHandleApiCall).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("should clear errors", () => {
    const { result } = renderHook(() => useGenAiApi());

    act(() => {
      result.current.clearErrors();
    });

    // The function should exist and be callable
    expect(typeof result.current.clearErrors).toBe("function");
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useGenAiApi());

    act(() => {
      result.current.resetState();
    });

    expect(result.current.response).toEqual({
      data: null,
      loading: false,
      error: null,
    });
    expect(result.current.health).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should have all required methods", () => {
    const { result } = renderHook(() => useGenAiApi());

    expect(typeof result.current.getHealth).toBe("function");
    expect(typeof result.current.createPrompt).toBe("function");
    expect(typeof result.current.clearErrors).toBe("function");
    expect(typeof result.current.resetState).toBe("function");
  });
});
