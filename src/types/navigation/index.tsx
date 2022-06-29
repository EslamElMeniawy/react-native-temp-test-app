import type {RootStackParamList, RootStackScreenProps} from './rootStack';

export type {RootStackParamList, RootStackScreenProps};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
