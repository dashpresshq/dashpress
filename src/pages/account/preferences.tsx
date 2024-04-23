import { UserPreferences } from "frontend/views/account/Preferences";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { loadCatalog } from "translations/utils";

export default UserPreferences;

export async function getStaticProps(
  ctx: GetStaticPropsContext
): Promise<GetStaticPropsResult<any>> {
  return {
    props: {
      translation: await loadCatalog(ctx.locale as string),
    },
  };
}
