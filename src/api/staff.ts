import { api } from "./axios";

export type UserRole = "ADMIN" | "EMPLOYEE" | "COLLECTOR";

export type User = {
  id: number;
  username: string;
  email?: string | null;
  role: UserRole;
  createdAt: string;
  lockedUntil?: string | null;
  failedLoginAttempts?: number | null;
};

export type CreateUserDto = {
  username: string;
  password: string;
  role: Exclude<UserRole, "ADMIN"> | UserRole;
  email?: string;
};

export type UpdateUserDto = Partial<{
  username: string;
  password: string;
  role: Exclude<UserRole, "ADMIN"> | UserRole;
  email: string;
}>;

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

export const fetchUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/auth/users");
  return res.data;
};

export const createUser = async (dto: CreateUserDto): Promise<User> => {
  const res = await api.post<User>("/auth/create-user", dto);
  return res.data;
};

export const updateUser = async (
  id: number,
  dto: UpdateUserDto
): Promise<User> => {
  const res = await api.patch<User>(`/auth/update-user/${id}`, dto);
  return res.data;
};

export const changePassword = async (
  dto: ChangePasswordDto
): Promise<{ success: boolean }> => {
  const res = await api.post<{ success: boolean }>(
    "/auth/change-password",
    dto
  );
  return res.data;
};
