export function removeItemAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

export function updateItemAt<T>(
  items: T[],
  index: number,
  updateItem: (item: T) => T,
) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? updateItem(item) : item,
  );
}
