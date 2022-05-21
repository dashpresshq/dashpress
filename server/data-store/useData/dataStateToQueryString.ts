import { IBEPaginatedDataState } from "./types";

export const dataStateToQueryString = ({
  page,
  search,
  pageSize = 10,
  order,
  filter,
}: IBEPaginatedDataState): string => {
  let url = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(
    pageSize
  )}`;
  if (search) {
    url = `${url}&searchTerm=${encodeURIComponent(search)}`;
  }
  if (order) {
    url = `${url}&orderField=${encodeURIComponent(
      order.field
    )}&orderBy=${encodeURIComponent(order.by)}`;
  }
  if (filter) {
    const additionalQuery = Object.entries(filter)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    url = `${url}&${additionalQuery}`;
  }
  return url;
};
