export interface LeafNode<T> {
  node: T;
}

export interface BranchNode<T> extends LeafNode<T> {
  children: TreeObject<T>[];
}

export type TreeObject<T> = LeafNode<T> | BranchNode<T>;

export const isBranchNode = <T>(to: TreeObject<T>): to is BranchNode<T> => {
  return (
    (to as BranchNode<T>).children !== undefined &&
    (to as BranchNode<T>).children.length > 0
  );
};
