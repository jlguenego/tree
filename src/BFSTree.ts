import {Tree} from './Tree';

export type BFSTreeTestValueFn<T> = (value: T) => boolean;
export type BFSTreeGetChildrenFn<T> = (value: T) => T[];

export class BFSTree<T> {
  currentTree: Tree<T>;
  constructor(
    private initValue: T,
    private test: BFSTreeTestValueFn<T>,
    private getChildren: BFSTreeGetChildrenFn<T>
  ) {
    this.currentTree = new Tree<T>(this.initValue);
  }

  search(): T | undefined {
    const stack = [this.currentTree];
    while (true) {
      const currentValue = stack.shift();
      if (currentValue === undefined) {
        return undefined;
      }
      if (this.test(currentValue.node)) {
        return currentValue.node;
      }
      const children = this.getChildren(currentValue.node);
      for (const c of children) {
        const scion = new Tree<T>(c);
        this.currentTree.graft(currentValue, scion);
        stack.push(scion);
      }
    }
  }
}
