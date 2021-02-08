import {SearchTreeAsync} from './SearchTreeAsync';
import {Tree} from './Tree';

export class DFSTreeAsync<T> extends SearchTreeAsync<T> {
  addOnStack(scion: Tree<T>): void {
    this.stack.unshift(scion);
  }
}
