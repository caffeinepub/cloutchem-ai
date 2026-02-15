import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SecurityQuestion } from '../backend';

export function useHasSecurityQuestions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasSecurityQuestions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.hasSecurityQuestions();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You must be logged in to check security question status');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetSecurityQuestions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questions: SecurityQuestion[]) => {
      if (!actor) throw new Error('Actor not available');
      if (questions.length < 2) {
        throw new Error('At least 2 security questions are required');
      }
      try {
        await actor.setSecurityQuestions(questions);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You must be logged in to set security questions');
        }
        if (error.message?.includes('already set')) {
          throw new Error('Security questions are already configured. Use account recovery to change them.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasSecurityQuestions'] });
    },
  });
}

export function useVerifySecurityQuestions() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (answers: SecurityQuestion[]) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.verifySecurityQuestions(answers);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You must be logged in to verify security questions');
        }
        if (error.message?.includes('verification failed')) {
          throw new Error('The answers provided do not match our records. Please try again.');
        }
        if (error.message?.includes('not completed')) {
          throw new Error('Security questions have not been set up yet.');
        }
        throw error;
      }
    },
  });
}

export function useResetSecurityQuestions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      newQuestions,
      currentAnswers,
    }: {
      newQuestions: SecurityQuestion[];
      currentAnswers: SecurityQuestion[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (newQuestions.length < 2) {
        throw new Error('At least 2 new security questions are required');
      }
      try {
        await actor.resetSecurityQuestions(newQuestions, currentAnswers);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You must be logged in to reset security questions');
        }
        if (error.message?.includes('verification failed')) {
          throw new Error('The current answers provided do not match our records. Please try again.');
        }
        if (error.message?.includes('No existing')) {
          throw new Error('No security questions found. Please set them up first.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasSecurityQuestions'] });
    },
  });
}
