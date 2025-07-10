import type { ApiState } from "@/types/api";

export const useApi = () => {
  const handleApiCall = async <T>(
    apiCall: () => Promise<{ data: T }>,
    setState: React.Dispatch<React.SetStateAction<ApiState<T>>>,
  ): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiCall();
      const data = response.data;
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setState((prev) => ({ ...prev, loading: false, error }));
      return null;
    }
  };

  const handleVoidApiCall = async (
    apiCall: () => Promise<{ data: void }>,
    setState: React.Dispatch<React.SetStateAction<ApiState<any>>>,
  ): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await apiCall();
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      setState((prev) => ({ ...prev, loading: false, error }));
      return false;
    }
  };

  return {
    handleApiCall,
    handleVoidApiCall,
  };
};
