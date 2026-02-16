import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Capture } from '../backend';

export function useGetMyCaptures() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Capture[]>({
    queryKey: ['myCaptures'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyCaptures();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveCapture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (capture: Capture) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCapture(capture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCaptures'] });
    },
  });
}

export function useDeleteCapture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (captureId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteCapture(captureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCaptures'] });
    },
  });
}
