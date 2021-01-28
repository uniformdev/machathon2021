import { IntentVector } from "@uniformdev/optimize-common";
import { buildTagField } from "./buildTagField";

export const buildIntentTagFilters = ({
  visitorScore,
  intentTagField = "intentTag",
}: {
  visitorScore: IntentVector;
  intentTagField?: string;
}) => {
  const fallbackCondition = buildTagField(intentTagField, "-tag");

  if (!visitorScore) {
    return [fallbackCondition];
  }

  const queryPieces = Object.keys(visitorScore).map((key) => {
    const val = visitorScore[key];
    const filter = buildTagField(intentTagField, key, val.str);
    return filter;
  });

  return [...queryPieces, fallbackCondition];
};
