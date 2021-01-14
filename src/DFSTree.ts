import {Tree} from './Tree';

export type DFSTreeTestValueFn<T> = (value: T) => boolean;
export type DFSTreeGetChildrenFn<T> = (value: T) => T[];

export class DFSTree<T> {
  currentTree: Tree<T>;
  constructor(
    private initValue: T,
    private test: DFSTreeTestValueFn<T>,
    private getChildren: DFSTreeGetChildrenFn<T>
  ) {
    this.currentTree = new Tree<T>(this.initValue);
  }

  search(): T | undefined {
    const stack = [this.currentTree];
    while (true) {
      if (stack.length === 0) {
        return undefined;
      }
      const currentValue = stack.shift();
      if (currentValue === undefined) {
        return undefined;
      }
      if (this.test(currentValue.node)) {
        return currentValue.node;
      }
      const children = this.getChildren(currentValue.node).reverse();
      for (const c of children) {
        const scion = new Tree<T>(c);
        this.currentTree.graft(currentValue, scion);
        stack.unshift(scion);
      }
    }
  }
}
