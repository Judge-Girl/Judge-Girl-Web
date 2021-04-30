

export function remove(array: any[], obj: any): void {
  const index = array.indexOf(obj, 0);
  if (index > -1) {
    this.subscribers.splice(index, 1);
  }
}
