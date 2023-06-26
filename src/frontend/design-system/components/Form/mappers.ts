export const mapIdAndNameToSelectData = (
  data: { id: string; name: string }[]
) => data.map(({ name, id }) => ({ value: id, label: name }));
