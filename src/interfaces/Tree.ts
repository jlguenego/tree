export interface Tree<T> {
  node: T;
  children?: Tree<T>[];
}

export interface BranchNode<T> {
  node: T;
  children: Tree<T>[];
}

export interface LeafNode<T> {
  node: T;
}
