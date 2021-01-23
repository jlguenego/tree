import {Subject} from 'rxjs';
import {Tree} from './Tree';

export type BFSTreeAsyncTestValueFn<T> = (value: T) => Promise<boolean>;
export type BFSTreeAsyncGetChildrenFn<T> = (value: T) => Promise<T[]>;

export interface BFSTreeInfo<T> {
  tree: Tree<T>;
  stack: Tree<T>[];
}

export class BFSTreeAsync<T> {
  currentTree: Tree<T>;
  subject = new Subject<BFSTreeInfo<T>>();
  constructor(
    private initValue: T,
    private test: BFSTreeAsyncTestValueFn<T>,
    private getChildren: BFSTreeAsyncGetChildrenFn<T>
  ) {
    this.currentTree = new Tree<T>(this.initValue);
  }

  async search(): Promise<T | undefined> {
    const stack = [this.currentTree];
    while (true) {
      this.subject.next({
        tree: this.currentTree,
        stack: stack,
      });
      if (stack.length === 0) {
        return undefined;
      }
      const currentValue = stack.shift();
      if (currentValue === undefined) {
        return undefined;
      }
      if (await this.test(currentValue.node)) {
        stack.length = 0;
        this.subject.next({
          tree: this.currentTree,
          stack: stack,
        });
        return currentValue.node;
      }
      const children = await this.getChildren(currentValue.node);
      for (const c of children) {
        const scion = new Tree<T>(c);
        this.currentTree.graft(currentValue, scion);
        stack.push(scion);
      }
    }
  }
}
