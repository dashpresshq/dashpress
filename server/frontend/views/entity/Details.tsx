import { AppLayout } from "../../_layouts/app";
import {
  ErrorAlert,
  SectionBox,
  SectionCenter,
  Spacer,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../hooks/entity/entity.config";
import { Plus } from "react-feather";
import { useRouter } from "next/router";
import {
  useEntityDataDetails,
} from "../../hooks/data/data.store";

export function EntityDetails() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const id = useEntityId();
  const dataDetails = useEntityDataDetails(entity, id);
  const router = useRouter();

  return (
    <AppLayout
      titleNeedsContext={true}
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        {
          label: "Details",
          value: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
        },
      ]}
      actionItems={[
        {
          label: "Details Settings",
          IconComponent: Plus,
          onClick: () =>
            router.push(NAVIGATION_LINKS.ENTITY.CONFIG.DETAILS(entity)),
        },
        {
          label: "Entity Fields",
          IconComponent: Plus,
          onClick: () =>
            router.push(NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity)),
        },
      ]}
    >
      <SectionCenter>
        {dataDetails.error ? (
          <>
            <Spacer />
            <ErrorAlert message={dataDetails.error} />
            <Spacer />
          </>
        ) : null}
        <SectionBox
          title={TitleLang.details(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: entityDiction.plural,
          }}
        >
          {dataDetails.isFetching || dataDetails.isIdle ? (
            <>TODO Loading Data...</>
          ) : (
            <>{JSON.stringify(dataDetails.data)}</>
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
