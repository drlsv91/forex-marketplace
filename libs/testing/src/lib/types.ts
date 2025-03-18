import { ObjectLiteral } from 'typeorm';

export type StoreKey = string | symbol;
export type PrimaryKey = string | number;

export type Dto = ObjectLiteral & {
  id?: PrimaryKey;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
