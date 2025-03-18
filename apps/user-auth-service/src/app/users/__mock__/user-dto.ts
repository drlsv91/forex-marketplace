import { faker } from '@faker-js/faker/.';
import { CreateUserDto } from '../dto/create-user.dto';

export const createUserDto: CreateUserDto = {
  email: faker.internet.email(),
  fullName: faker.person.fullName(),
  password: faker.string.alphanumeric(10),
};
