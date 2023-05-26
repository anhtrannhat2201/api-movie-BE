export class PagiRes<T> {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  items: Array<T>;

  constructor(resItems: Partial<PagiRes<T>>) {
    Object.assign(this, resItems);
  }

  res() {
    return {
      currentPage: this.currentPage,
      itemsOnThisPage: this.items.length,
      totalPages: Math.ceil(this.totalItems / this.itemsPerPage),
      totalItems: this.totalItems,
      items: this.items,
    };
  }
}
