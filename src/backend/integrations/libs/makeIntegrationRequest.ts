interface IConfig {
  body?: string | FormData;
  url: string;
  headers: string;
}

export const makeIntegrationRequest = async (
  method: "POST" | "PUT" | "PATCH" | "DELETE" | "GET",
  configuration: IConfig
) => {
  const response = await fetch(configuration.url, {
    method,
    headers: configuration.headers
      ? JSON.parse(configuration.headers)
      : undefined,
    body: configuration.body ? configuration.body : undefined,
  });
  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      return response;
    }
  }
  const error = await response.json();
  throw new Error(error.message);
};
