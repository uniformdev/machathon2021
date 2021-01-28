import { useUniformTracker } from '@uniformdev/optimize-tracker-react';

export const useHasIntentScores = (): boolean => {
  const tracker = useUniformTracker();
  return Object.keys(tracker?.intentScores || {}).length > 0;
};
