import React, { useState, useCallback } from "react";
import { UserApi, type UserDto, type CreateUserDto } from "../api/api";
import { type ApiState, createInitialApiState } from "../types/api";
import { Configuration } from "@/api/configuration";

const userApi = new UserApi(
  new Configuration({ basePath: import.meta.env.VITE_API_URL }),
);

interface UserApiHook {
  users: ApiState<UserDto[]>;
  user: ApiState<UserDto>;
  createdUser: ApiState<UserDto>;

  getAllUsers: () => Promise<void>;
  getUserById: (id: number) => Promise<void>;
  createUser: (data: CreateUserDto) => Promise<void>;
  updateUser: (id: number, data: UserDto) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  clearErrors: () => void;
  resetState: () => void;
}

export const useUserApi = (): UserApiHook => {
  const [users, setUsers] = useState<ApiState<UserDto[]>>(
    createInitialApiState,
  );
  const [user, setUser] = useState<ApiState<UserDto>>(createInitialApiState);
  const [createdUser, setCreatedUser] = useState<ApiState<UserDto>>(
    createInitialApiState,
  );

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

  const getAllUsers = useCallback(async () => {
    await handleApiCall(() => userApi.getAllUsers(), setUsers);
  }, []);

  const getUserById = useCallback(async (id: number) => {
    await handleApiCall(() => userApi.getUserById(id), setUser);
  }, []);

  const createUser = useCallback(
    async (data: CreateUserDto) => {
      const result = await handleApiCall(
        () => userApi.createUser(data),
        setCreatedUser,
      );
      if (result) {
        await getAllUsers();
      }
    },
    [getAllUsers],
  );

  const updateUser = useCallback(
    async (id: number, data: UserDto) => {
      const result = await handleApiCall(
        () => userApi.updateUser(id, data),
        setUser,
      );
      if (result) {
        await getAllUsers();
      }
    },
    [getAllUsers],
  );

  const deleteUser = useCallback(
    async (id: number) => {
      const success = await handleVoidApiCall(
        () => userApi.deleteUser(id),
        setUser,
      );
      if (success) {
        await getAllUsers();
      }
    },
    [getAllUsers],
  );

  const clearErrors = useCallback(() => {
    setUsers((prev) => ({ ...prev, error: null }));
    setUser((prev) => ({ ...prev, error: null }));
    setCreatedUser((prev) => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setUsers(createInitialApiState());
    setUser(createInitialApiState());
    setCreatedUser(createInitialApiState());
  }, []);

  return {
    users,
    user,
    createdUser,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    clearErrors,
    resetState,
  };
};
