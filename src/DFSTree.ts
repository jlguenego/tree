import {SearchTree} from './SearchTree';
import {Tree} from './Tree';

export class DFSTree<T> extends SearchTree<T> {
  addOnStack(scion: Tree<T>): void {
    this.stack.unshift(scion);
  }
}
