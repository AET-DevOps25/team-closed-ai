import { useState, useCallback } from "react";
import {
  UserApi,
  type UserDto,
  type CreateUserDto,
  Configuration,
} from "@/api/server";
import { type ApiState, createInitialApiState } from "../types/api";
import { useApi } from "./use-api";

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
  const { handleApiCall, handleVoidApiCall } = useApi();

  const [users, setUsers] = useState<ApiState<UserDto[]>>(
    createInitialApiState,
  );
  const [user, setUser] = useState<ApiState<UserDto>>(createInitialApiState);
  const [createdUser, setCreatedUser] = useState<ApiState<UserDto>>(
    createInitialApiState,
  );

  const getAllUsers = useCallback(async () => {
    await handleApiCall(() => userApi.getAllUsers(), setUsers);
  }, [handleApiCall]);

  const getUserById = useCallback(
    async (id: number) => {
      await handleApiCall(() => userApi.getUserById(id), setUser);
    },
    [handleApiCall],
  );

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
    [handleApiCall, getAllUsers],
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
    [handleApiCall, getAllUsers],
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
    [handleVoidApiCall, getAllUsers],
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
