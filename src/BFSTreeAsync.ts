import {Subject} from 'rxjs';
import {BFSTreeInfo} from './interfaces/BFSTreeInfo';
import {Tree} from './Tree';

export type BFSTreeAsyncTestValueFn<T> = (value: T) => Promise<boolean>;
export type BFSTreeAsyncGetChildrenFn<T> = (value: T) => Promise<T[]>;

export class BFSTreeAsync<T> {
  private keepGoing = true;
  found = false;
  foundValue: T | undefined = undefined;

  currentValue: Tree<T> | undefined = undefined;

  currentTree: Tree<T>;
  stack: Tree<T>[];
  subject = new Subject<BFSTreeInfo<T>>();
  maxStackSize = 0;
  testNbr = 0;

  messageId = 0;

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
    this.found = false;
    this.foundValue = undefined;
    this.messageId = 0;
  }

  log() {
    this.messageId++;
    this.subject.next({
      tree: this.currentTree,
      stack: this.stack,
      currentValue: this.currentValue,
      metrics: {
        treeSize: this.currentTree.getSize(),
        maxStackSize: this.maxStackSize,
        testNbr: this.testNbr,
        messageId: this.messageId,
      },
    });
  }

  async search(): Promise<T | undefined> {
    this.keepGoing = true;
    if (this.found) {
      console.log('already found');
      return this.foundValue;
    }
    while (this.keepGoing) {
      if (this.stack.length === 0) {
        return undefined;
      }
      this.currentValue = this.stack[0];
      if (this.currentValue === undefined) {
        return undefined;
      }
      this.log();
      if (await this.test(this.currentValue.node)) {
        this.found = true;
        this.foundValue = this.currentValue.node;
        if (!this.keepGoing) {
          break;
        }
        this.stack.length = 0;
        this.log();
        return this.foundValue;
      }
      const children = await this.getChildren(this.currentValue.node);
      if (!this.keepGoing) {
        break;
      }

      // update the stack and add the children (synchrone)
      this.updateState(children);
    }
    return undefined;
  }

  updateState(children: T[]) {
    this.currentValue = this.stack.shift() as Tree<T>;
    for (const c of children) {
      const scion = new Tree<T>(c);
      this.currentTree.graft(this.currentValue, scion);
      this.stack.push(scion);
    }
    this.maxStackSize = Math.max(this.maxStackSize, this.stack.length);
    this.testNbr++;
  }

  interrupt() {
    this.keepGoing = false;
  }
}
