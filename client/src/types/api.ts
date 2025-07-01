export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const createInitialApiState = <T>(): ApiState<T> => ({
  data: null,
  loading: false,
  error: null,
});
