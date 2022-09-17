import { FormNoValueSelect } from "@hadmean/chromista";

export function DashboardSettings() {
  return (
    <FormNoValueSelect
      disabledOptions={[]}
      selectData={[
        {
          label: "Summary Card",
          value: "Summary Card",
        },
        {
          label: "Bar Chart",
          value: "Bar Chart",
        },
        {
          label: "Line Chart",
          value: "Line Chart",
        },
        {
          label: "Pie Chart",
          value: "Pie Chart",
        },
        {
          label: "Pivot Table",
          value: "Pivot Table",
        },
        {
          label: "Table",
          value: "Table",
        },
        {
          label: "Histogram",
          value: "Histogram",
        },
      ]}
      onChange={() => {}}
    />
  );
}
