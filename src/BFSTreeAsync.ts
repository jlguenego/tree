import {Subject} from 'rxjs';
import {BFSTreeInfo} from './interfaces/BFSTreeInfo';
import {Tree} from './Tree';

export type BFSTreeAsyncTestValueFn<T> = (value: T) => Promise<boolean>;
export type BFSTreeAsyncGetChildrenFn<T> = (value: T) => Promise<T[]>;

export class BFSTreeAsync<T> {
  currentTree: Tree<T>;
  stack: Tree<T>[];
  subject = new Subject<BFSTreeInfo<T>>();
  private keepGoing = true;
  private maxStackSize = 0;
  private testNbr = 0;
  constructor(
    private initValue: T,
    private test: BFSTreeAsyncTestValueFn<T>,
    private getChildren: BFSTreeAsyncGetChildrenFn<T>
  ) {
    this.currentTree = new Tree<T>(this.initValue);
    this.stack = [this.currentTree];
  }

  reset() {
    this.currentTree = new Tree<T>(this.initValue);
    this.stack = [this.currentTree];
    this.maxStackSize = this.stack.length;
    this.testNbr = 0;
  }

  async search(): Promise<T | undefined> {
    this.keepGoing = true;
    while (this.keepGoing) {
      if (this.stack.length === 0) {
        return undefined;
      }
      const currentValue = this.stack.shift();
      if (currentValue === undefined) {
        return undefined;
      }
      this.subject.next({
        tree: this.currentTree,
        stack: this.stack,
        currentValue: currentValue,
        metrics: {
          treeSize: this.currentTree.getSize(),
          maxStackSize: this.maxStackSize,
          testNbr: this.testNbr,
        },
      });
      if (await this.test(currentValue.node)) {
        if (!this.keepGoing) {
          break;
        }
        this.stack.length = 0;
        this.subject.next({
          tree: this.currentTree,
          stack: this.stack,
          currentValue: currentValue,
          metrics: {
            treeSize: this.currentTree.getSize(),
            maxStackSize: this.maxStackSize,
            testNbr: this.testNbr,
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
        this.stack.push(scion);
      }
      this.maxStackSize = Math.max(this.maxStackSize, this.stack.length);
      this.testNbr++;
    }
    return undefined;
  }

  interrupt() {
    this.keepGoing = false;
  }
}
