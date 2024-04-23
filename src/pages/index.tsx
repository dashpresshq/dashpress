import { Dashboard } from "frontend/views/Dashboard/List";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { loadCatalog } from "translations/utils";

export default Dashboard;

export async function getStaticProps(
  ctx: GetStaticPropsContext
): Promise<GetStaticPropsResult<any>> {
  return {
    props: {
      translation: await loadCatalog(ctx.locale as string),
    },
  };
}
