import {Tree} from '../Tree';
import {Metrics} from './Metrics';

export interface SearchTreeInfo<T> {
  tree: Tree<T>;
  stack: Tree<T>[];
  currentValue?: Tree<T>;
  metrics: Metrics;
}
