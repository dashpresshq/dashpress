import { noop } from "@/shared/lib/noop";

export function useDataUpdateActions({
  entity,
  entityId,
}: {
  entityId: string;
  entity: string;
}) {
  noop(entity, entityId);
}
