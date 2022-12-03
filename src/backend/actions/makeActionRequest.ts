interface IConfig {
  body: string;
  url: string;
  headers: string;
}
export const makeActionRequest = async (
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  configuration: IConfig
) => {
  const response = await fetch(configuration.url, {
    method,
    headers: JSON.parse(configuration.headers),
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
