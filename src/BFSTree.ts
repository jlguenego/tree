import {SearchTree} from './SearchTree';
import {Tree} from './Tree';

export class BFSTree<T> extends SearchTree<T> {
  addOnStack(scion: Tree<T>): void {
    this.stack.push(scion);
  }
}
