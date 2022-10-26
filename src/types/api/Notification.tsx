import {FlatListItem} from 'roqay-react-native-common-components';

interface Notification extends FlatListItem {
  id?: number | string;
  title?: string;
  message?: string;
}

export default Notification;
