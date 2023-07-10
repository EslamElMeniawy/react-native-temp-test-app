import type {User} from 'types';

export const userResponseToUser = (userResponse: any): User => ({
  // TODO: Change this mapping based on API response.
  id: userResponse.id,
  name: userResponse.name,
  email: userResponse.email,
  phone: userResponse.phone,
});
