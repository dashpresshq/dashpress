import { Dashboard } from "frontend/views/Dashboard/List";

export default Dashboard;

export async function getStaticProps(context) {
  return {
    props: {
      messages: (await import(`../../locales/${context.locale}.json`)).default,
    },
  };
}
