import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useApi } from "@/hooks/use-api";
import type { ApiState } from "@/types/api";

describe("useApi", () => {
  it("should handle successful API call", async () => {
    const { result } = renderHook(() => useApi());

    const mockData = { id: 1, name: "Test" };
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData });
    const mockSetState = vi.fn();

    await act(async () => {
      const response = await result.current.handleApiCall(
        mockApiCall,
        mockSetState,
      );
      expect(response).toEqual(mockData);
    });

    // Should set loading to true initially
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Should set success state
    expect(mockSetState).toHaveBeenCalledWith({
      data: mockData,
      loading: false,
      error: null,
    });
  });

  it("should handle API call error", async () => {
    const { result } = renderHook(() => useApi());

    const mockError = new Error("API Error");
    const mockApiCall = vi.fn().mockRejectedValue(mockError);
    const mockSetState = vi.fn();

    await act(async () => {
      const response = await result.current.handleApiCall(
        mockApiCall,
        mockSetState,
      );
      expect(response).toBe(null);
    });

    // Should set loading to true initially
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Should set error state
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Check that the function passed to setState sets the error correctly
    const lastCall =
      mockSetState.mock.calls[mockSetState.mock.calls.length - 1][0];
    const mockPrevState: ApiState<any> = {
      data: null,
      loading: true,
      error: null,
    };
    const newState = lastCall(mockPrevState);

    expect(newState).toEqual({
      data: null,
      loading: false,
      error: "API Error",
    });
  });

  it("should handle non-Error exceptions", async () => {
    const { result } = renderHook(() => useApi());

    const mockApiCall = vi.fn().mockRejectedValue("String error");
    const mockSetState = vi.fn();

    await act(async () => {
      const response = await result.current.handleApiCall(
        mockApiCall,
        mockSetState,
      );
      expect(response).toBe(null);
    });

    // Check that non-Error exceptions are handled
    const lastCall =
      mockSetState.mock.calls[mockSetState.mock.calls.length - 1][0];
    const mockPrevState: ApiState<any> = {
      data: null,
      loading: true,
      error: null,
    };
    const newState = lastCall(mockPrevState);

    expect(newState.error).toBe("An error occurred");
  });

  it("should handle successful void API call", async () => {
    const { result } = renderHook(() => useApi());

    const mockApiCall = vi.fn().mockResolvedValue({ data: undefined });
    const mockSetState = vi.fn();

    await act(async () => {
      const response = await result.current.handleVoidApiCall(
        mockApiCall,
        mockSetState,
      );
      expect(response).toBe(true);
    });

    // Should set loading to true initially
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Should set success state
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Check the final state
    const lastCall =
      mockSetState.mock.calls[mockSetState.mock.calls.length - 1][0];
    const mockPrevState: ApiState<any> = {
      data: null,
      loading: true,
      error: null,
    };
    const newState = lastCall(mockPrevState);

    expect(newState).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it("should handle void API call error", async () => {
    const { result } = renderHook(() => useApi());

    const mockError = new Error("Void API Error");
    const mockApiCall = vi.fn().mockRejectedValue(mockError);
    const mockSetState = vi.fn();

    await act(async () => {
      const response = await result.current.handleVoidApiCall(
        mockApiCall,
        mockSetState,
      );
      expect(response).toBe(false);
    });

    // Should set loading to true initially
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Should set error state
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Check that the error is set correctly
    const lastCall =
      mockSetState.mock.calls[mockSetState.mock.calls.length - 1][0];
    const mockPrevState: ApiState<any> = {
      data: null,
      loading: true,
      error: null,
    };
    const newState = lastCall(mockPrevState);

    expect(newState.error).toBe("Void API Error");
  });

  it("should clear error on loading state", async () => {
    const { result } = renderHook(() => useApi());

    const mockApiCall = vi.fn().mockResolvedValue({ data: "test" });
    const mockSetState = vi.fn();

    await act(async () => {
      await result.current.handleApiCall(mockApiCall, mockSetState);
    });

    // Check that loading state clears previous error
    const loadingCall = mockSetState.mock.calls[0][0];
    const mockPrevStateWithError: ApiState<any> = {
      data: null,
      loading: false,
      error: "Previous error",
    };
    const loadingState = loadingCall(mockPrevStateWithError);

    expect(loadingState).toEqual({
      data: null,
      loading: true,
      error: null,
    });
  });
});
