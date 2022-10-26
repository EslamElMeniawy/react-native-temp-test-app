import BaseUser from './BaseUser';

interface User extends BaseUser {
  apiToken?: string;
  fcmToken?: string;
}

export default User;
