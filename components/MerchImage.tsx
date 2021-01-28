import { IntentVector } from '@uniformdev/optimize-common';

export const getMerchImage = (
  images: Record<string, string>,
  visitorIntents?: IntentVector,
  explicitSelection?: string
): string | undefined => {
  if (explicitSelection) {
    return images[explicitSelection];
  }

  const variations = Object.keys(images);

  if (variations.length === 0) {
    return undefined;
  }

  if (visitorIntents) {
    const intentsByScore = Object.keys(visitorIntents)
      // only attributes (with >) that have a score need be evaluated
      .filter((intent) => intent.includes('>') && visitorIntents[intent].str)
      // convert to array with str
      .map((intentId) => ({
        id: intentId,
        str: Number(visitorIntents[intentId].str ?? 0),
      }))
      // sort descending
      .sort((a, b) => b.str - a.str);

    // from highest to lowest attribute score see if we have an image
    for(const intent of intentsByScore) {
      const variationImage = images[intent.id];

      if (variationImage) return variationImage;
    }
  }

  // no matches so far, try standard
  if (images.standard) {
    return images.standard;
  }

  // if only variant images exist, no standard image, we take the first one
  return images[variations[0]];
};
