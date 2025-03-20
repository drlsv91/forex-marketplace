import { User } from 'types/proto/auth';
import { faker } from '@faker-js/faker';

export const user: User = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  fullName: faker.person.fullName(),
};
