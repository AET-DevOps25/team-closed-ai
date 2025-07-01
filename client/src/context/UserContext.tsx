import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useUserApi } from "@/hooks/use-user-api";
import type { UserDto, CreateUserDto } from "@/api/api";
import type { User } from "@/types";

interface UserContextType {
  users: User[];
  defaultUser: User | null;
  loading: boolean;
  error: string | null;
  setDefaultUser: (user: User | null) => void;
  createUser: (userData: CreateUserDto) => Promise<void>;
  updateUser: (userId: number, userData: Partial<UserDto>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  getUserById: (userId: number) => Promise<User | null>;
  refetch: () => Promise<void>;
  clearErrors: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER_KEY = "closedai_default_user";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userApi = useUserApi();
  const [defaultUser, setDefaultUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem(DEFAULT_USER_KEY);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setDefaultUserState(user);
      } catch (error) {
        console.error("Failed to parse saved default user:", error);
        localStorage.removeItem(DEFAULT_USER_KEY);
      }
    }
  }, []);

  useEffect(() => {
    userApi.getAllUsers();
  }, []);

  useEffect(() => {
    if (userApi.users.data) {
      setUsers(userApi.users.data as User[]);
    }
  }, [userApi.users.data]);

  useEffect(() => {
    if (users.length === 0) return;

    setDefaultUserState((prevDefaultUser) => {
      if (prevDefaultUser) {
        const existingUser = users.find((u) => u.id === prevDefaultUser.id);
        if (!existingUser) {
          localStorage.removeItem(DEFAULT_USER_KEY);
          return null;
        }
        return prevDefaultUser;
      } else {
        const firstUser = users[0];
        localStorage.setItem(DEFAULT_USER_KEY, JSON.stringify(firstUser));
        return firstUser;
      }
    });
  }, [users]);

  const setDefaultUser = (user: User | null) => {
    setDefaultUserState(user);
    if (user) {
      localStorage.setItem(DEFAULT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEFAULT_USER_KEY);
    }
  };

  const createUser = async (userData: CreateUserDto) => {
    await userApi.createUser(userData);
  };

  const updateUser = async (userId: number, userData: Partial<UserDto>) => {
    await userApi.updateUser(userId, userData as UserDto);
    if (defaultUser?.id === userId) {
      await getUserById(userId);
    }
  };

  const deleteUser = async (userId: number) => {
    await userApi.deleteUser(userId);
    if (defaultUser?.id === userId) {
      setDefaultUser(null);
    }
  };

  const getUserById = async (userId: number): Promise<User | null> => {
    await userApi.getUserById(userId);
    if (userApi.user.data) {
      const mappedUser = userApi.user.data as User;
      if (defaultUser?.id === userId) {
        setDefaultUser(mappedUser);
      }
      return mappedUser;
    }
    return null;
  };

  const refetch = async () => {
    await userApi.getAllUsers();
  };

  const clearErrors = () => {
    userApi.clearErrors();
  };

  const loading =
    userApi.users.loading ||
    userApi.user.loading ||
    userApi.createdUser.loading;

  const error =
    userApi.users.error || userApi.user.error || userApi.createdUser.error;

  return (
    <UserContext.Provider
      value={{
        users,
        defaultUser,
        loading,
        error,
        setDefaultUser,
        createUser,
        updateUser,
        deleteUser,
        getUserById,
        refetch,
        clearErrors,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
