import {Subject} from 'rxjs';
import {Tree} from './Tree';

export type BFSTreeAsyncTestValueFn<T> = (value: T) => Promise<boolean>;
export type BFSTreeAsyncGetChildrenFn<T> = (value: T) => Promise<T[]>;

export interface Metrics {
  treeSize: number;
  maxStackSize: number;
  testNbr: number;
}

export interface BFSTreeInfo<T> {
  tree: Tree<T>;
  stack: Tree<T>[];
  currentValue?: Tree<T>;
  metrics: Metrics;
}

export class BFSTreeAsync<T> {
  currentTree: Tree<T>;
  subject = new Subject<BFSTreeInfo<T>>();
  private keepGoing = true;
  constructor(
    private initValue: T,
    private test: BFSTreeAsyncTestValueFn<T>,
    private getChildren: BFSTreeAsyncGetChildrenFn<T>
  ) {
    this.currentTree = new Tree<T>(this.initValue);
  }

  async search(): Promise<T | undefined> {
    const stack = [this.currentTree];
    let maxStackSize = stack.length;
    let testNbr = 1;
    this.keepGoing = true;
    while (this.keepGoing) {
      this.subject.next({
        tree: this.currentTree,
        stack: stack,
        metrics: {
          treeSize: this.currentTree.getSize(),
          maxStackSize,
          testNbr,
        },
      });
      if (stack.length === 0) {
        return undefined;
      }
      const currentValue = stack.shift();
      if (currentValue === undefined) {
        return undefined;
      }
      this.subject.next({
        tree: this.currentTree,
        stack: stack,
        currentValue: currentValue,
        metrics: {
          treeSize: this.currentTree.getSize(),
          maxStackSize,
          testNbr,
        },
      });
      if (await this.test(currentValue.node)) {
        if (!this.keepGoing) {
          break;
        }
        stack.length = 0;
        this.subject.next({
          tree: this.currentTree,
          stack: stack,
          currentValue: currentValue,
          metrics: {
            treeSize: this.currentTree.getSize(),
            maxStackSize,
            testNbr,
          },
        });
        return currentValue.node;
      }
      const children = await this.getChildren(currentValue.node);
      if (!this.keepGoing) {
        break;
      }
      for (const c of children) {
        const scion = new Tree<T>(c);
        this.currentTree.graft(currentValue, scion);
        stack.push(scion);
      }
      maxStackSize = Math.max(maxStackSize, stack.length);
      testNbr++;
    }
    return undefined;
  }

  interrupt() {
    this.keepGoing = false;
  }
}
