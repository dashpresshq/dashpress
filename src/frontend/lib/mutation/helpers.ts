/* eslint-disable default-param-last */
// eslint-disable-next-line default-param-last
export function remove<T>(old: T[] | undefined = [], formData: T) {
  return [
    ...old.filter(
      (oldItem) => JSON.stringify(formData) !== JSON.stringify(oldItem)
    ),
  ];
}

export function deleteByKey<T extends Record<string, string>>(key: keyof T) {
  return (old: T[] | undefined = [], currentDataId: string) => [
    ...old.filter((oldData) => currentDataId !== oldData[key]),
  ];
}
