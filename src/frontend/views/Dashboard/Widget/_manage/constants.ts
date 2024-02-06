const mapToUnitOptions = (values: number[]) =>
  values.map((value) => ({
    label: value === 1 ? `1 Unit` : `${value} Units`,
    value: `${value}`,
  }));

export const DASHBOARD_WIDGET_SPANS = mapToUnitOptions([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
]);

export const DASHBOARD_WIDGET_HEIGHTS = mapToUnitOptions([
  1, 2, 3, 4, 5, 6, 7, 8,
]);
