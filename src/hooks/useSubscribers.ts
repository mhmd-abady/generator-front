import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubscribers,
  fetchSubscribersByNeighborhood,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  type Subscriber,
  type CreateSubscriberDto,
  type UpdateSubscriberDto,
} from "../api/subscribers";

export function useSubscribers(neighborhoodId?: number) {
  const queryClient = useQueryClient();

  const listQuery = useQuery<Subscriber[]>({
    queryKey: ["subscribers", neighborhoodId],
    queryFn: () =>
      neighborhoodId
        ? fetchSubscribersByNeighborhood(neighborhoodId)
        : fetchSubscribers(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateSubscriberDto) =>
      createSubscriber(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: UpdateSubscriberDto;
    }) => updateSubscriber(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });

  return {
    subscribers: listQuery.data,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    createSubscriber: createMutation,
    updateSubscriber: updateMutation,
    deleteSubscriber: deleteMutation,
  };
}
