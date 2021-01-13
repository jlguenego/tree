export interface Tree<T> {
  v: T;
  c?: Tree<T>[];
}
