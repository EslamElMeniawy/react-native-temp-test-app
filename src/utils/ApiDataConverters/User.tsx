import {User} from '../../types';

export const userResponseToUser = (userResponse: any): User => ({
  id: userResponse.id,
  name: userResponse.name,
  email: userResponse.email,
  phone: userResponse.phone,
});
