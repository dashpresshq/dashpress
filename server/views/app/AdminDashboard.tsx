import { getAllModels } from "../../lib/schema/models";
import {FullLayout} from "../../views/_layouts/app";

// Improvement, being able to add dashboard items here

export function AdminDashboard() {
  const fields = getAllModels();

  return <FullLayout>{fields.map(field => <div key={field.value}>{field.label}</div>)}</FullLayout>;
}
