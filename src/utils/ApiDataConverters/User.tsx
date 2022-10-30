import {User} from '../../types';

// TODO: Change this based on API response.
export const userResponseToUser = (userResponse: any): User => ({
  id: userResponse.id,
  name: userResponse.name,
  email: userResponse.email,
  phone: userResponse.phone,
});
