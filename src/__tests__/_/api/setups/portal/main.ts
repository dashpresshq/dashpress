import type { PortalConfigDomain } from "@/backend/lib/config-persistence/portal/main/types";

export const portalTestData: [PortalConfigDomain, () => Promise<void>][] = [];
