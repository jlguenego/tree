import {Tree} from './Tree';

export type SearchTreeTestValueFn<T> = (value: T) => boolean;
export type SearchTreeGetChildrenFn<T> = (value: T) => T[];

export abstract class SearchTree<T> {
  currentTree: Tree<T>;
  stack: Tree<T>[] = [];

  constructor(
    private initValue: T,
    private test: SearchTreeTestValueFn<T>,
    private getChildren: SearchTreeGetChildrenFn<T>
  ) {
    this.currentTree = new Tree<T>(this.initValue);
  }

  search(): T | undefined {
    this.stack = [this.currentTree];
    while (true) {
      if (this.stack.length === 0) {
        return undefined;
      }
      const currentValue = this.stack.shift();
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
        this.addOnStack(scion);
      }
    }
  }

  abstract addOnStack(scion: Tree<T>): void;
}
