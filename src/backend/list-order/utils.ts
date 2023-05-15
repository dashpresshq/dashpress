export function sortByListOrder<T extends { id: string }>(
  order: string[],
  itemListOrder: T[]
): T[] {
  if (order.length === 0) {
    return itemListOrder;
  }
  const itemsMap = Object.fromEntries(
    itemListOrder.map((item) => [item.id, item])
  );

  const orderedItems = order.map((item) => itemsMap[item]);

  if (order.length === itemListOrder.length) {
    return orderedItems;
  }

  const remainingItems = itemListOrder.filter(
    (item) => !order.includes(item.id)
  );

  return [...orderedItems, ...remainingItems];
}
