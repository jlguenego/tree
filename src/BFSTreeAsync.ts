import {SearchTreeAsync} from './SearchTreeAsync';
import {Tree} from './Tree';

export class BFSTreeAsync<T> extends SearchTreeAsync<T> {
  addOnStack(scion: Tree<T>): void {
    this.stack.push(scion);
  }
}
