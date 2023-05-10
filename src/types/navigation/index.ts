import type {RootStackParamList} from './rootStack';

export * from './rootStack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
