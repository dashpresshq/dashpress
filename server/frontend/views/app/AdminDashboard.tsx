import { useSchemaList } from "../../data-store/schema.data-store";
import { AppLayout } from "../../_layouts/app";

// Improvement, being able to add dashboard items here

export function AdminDashboard() {
  const schemaList = useSchemaList();

  if (schemaList.isFetching) {
    return "Loading";
  }

  return (
    <AppLayout>
      {schemaList.data.map((field) => (
        <div key={field.value}>{field.label}</div>
      ))}
    </AppLayout>
  );
}
