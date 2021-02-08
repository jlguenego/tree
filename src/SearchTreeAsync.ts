import {Subject} from 'rxjs';
import {SearchTreeInfo} from './interfaces/SearchTreeInfo';
import {Tree} from './Tree';

export type SearchTreeAsyncTestValueFn<T> = (value: T) => Promise<boolean>;
export type SearchTreeAsyncGetChildrenFn<T> = (value: T) => Promise<T[]>;

export abstract class SearchTreeAsync<T> {
  searching = false;
  interrupted = false;
  found = false;
  foundValue: T | undefined = undefined;

  currentValue: Tree<T> | undefined = undefined;

  currentTree: Tree<T>;
  stack: Tree<T>[];
  subject = new Subject<SearchTreeInfo<T>>();
  maxStackSize = 0;
  testNbr = 0;

  messageId = 0;

  constructor(
    private initValue: T,
    private test: SearchTreeAsyncTestValueFn<T>,
    private getChildren: SearchTreeAsyncGetChildrenFn<T>
  ) {
    this.currentTree = new Tree<T>(this.initValue);
    this.stack = [this.currentTree];
  }

  reset() {
    this.searching = false;
    this.interrupted = false;
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
    this.searching = true;
    this.interrupted = false;
    if (this.found) {
      this.searching = false;
      return this.foundValue;
    }
    while (!this.interrupted) {
      if (this.stack.length === 0) {
        this.searching = false;
        return undefined;
      }
      this.currentValue = this.stack[0];
      this.log();
      if (await this.test(this.currentValue.node)) {
        this.found = true;
        this.foundValue = this.currentValue.node;
        if (this.interrupted) {
          break;
        }
        this.stack.length = 0;
        this.log();
        this.searching = false;
        return this.foundValue;
      }
      const children = await this.getChildren(this.currentValue.node);
      if (this.interrupted) {
        break;
      }

      // update the stack and add the children (synchrone)
      this.updateState(children);
    }
    // still searching but interrupted.
    return undefined;
  }

  updateState(children: T[]) {
    this.currentValue = this.stack.shift() as Tree<T>;
    for (const c of children) {
      const scion = new Tree<T>(c);
      this.currentTree.graft(this.currentValue, scion);
      this.addOnStack(scion);
      // this.stack.push(scion);
    }
    this.maxStackSize = Math.max(this.maxStackSize, this.stack.length);
    this.testNbr++;
  }

  interrupt() {
    this.interrupted = true;
  }

  abstract addOnStack(scion: Tree<T>): void;
}
