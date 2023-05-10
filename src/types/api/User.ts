import BaseUser from './BaseUser';

interface User extends BaseUser {
  unreadNotificationsCount?: number;
  apiToken?: string;
  fcmToken?: string;
}

export default User;
