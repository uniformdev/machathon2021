export const buildTagField = (
  field: string,
  value: string,
  score?: number | string
) => {
  let fieldFilter = `${field}:${value}`;

  if (score) {
    fieldFilter += `<score=${parseInt(score.toString())}>`;
  }

  return fieldFilter;
};
