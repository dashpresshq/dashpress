export function getHeirarchyDependencies<
  T extends { parentId: string; id: string }
>(needle: string, haystack: T[], dependency: T[] = []): T[] {
  if (!needle) {
    return dependency;
  }
  const currentItem = haystack.find((entry) => entry.id === needle);
  if (!currentItem) {
    return dependency;
  }
  dependency.push(currentItem);
  if (!currentItem.parentId) {
    return dependency;
  }
  return getHeirarchyDependencies(currentItem.parentId, haystack, dependency);
}
