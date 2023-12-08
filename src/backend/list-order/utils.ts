export function sortListByOrder<T extends { id: string }>(
  order: string[],
  itemsToOrder: T[]
): T[] {
  if (order.length === 0) {
    return itemsToOrder;
  }
  const itemsMap = Object.fromEntries(
    itemsToOrder.map((item) => [item.id, item])
  );

  const orderedItems = order.map((item) => itemsMap[item]);

  if (order.length === itemsToOrder.length) {
    return orderedItems;
  }

  const remainingItems = itemsToOrder.filter(
    (item) => !order.includes(item.id)
  );

  return [...orderedItems, ...remainingItems].filter(Boolean);
}
