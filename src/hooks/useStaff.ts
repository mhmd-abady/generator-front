import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  createUser,
  fetchUsers,
  updateUser,
  type ChangePasswordDto,
  type CreateUserDto,
  type UpdateUserDto,
  type User,
} from "../api/staff";

export function useStaff(enabled = true) {
  const qc = useQueryClient();

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateUserDto) => createUser(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: UpdateUserDto;
    }) => updateUser(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (dto: ChangePasswordDto) => changePassword(dto),
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    createUser: createMutation,
    updateUser: updateMutation,
    changePassword: changePasswordMutation,
  };
}
