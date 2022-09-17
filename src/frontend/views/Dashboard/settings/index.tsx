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
          label: "Table",
          value: "Table",
        },
      ]}
      onChange={() => {}}
    />
  );
}
