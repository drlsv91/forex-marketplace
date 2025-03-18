import { plainToInstance } from 'class-transformer';
import { FindOperator } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Dto, PrimaryKey } from './types';

export function addDtoClass<T>(record: T) {
  return {
    ...record,
    toDto() {
      return this;
    },
  };
}

export function saveRecord<Entity extends Dto>(
  store: Entity[],
  record: Entity
) {
  record.id = record.id ?? uuidv4();
  record.createdAt = new Date();
  record.updatedAt = new Date();
  record.deletedAt = record.deletedAt || null || undefined;
  store.push(record);
  return addDtoClass(record);
}

export function findOneByConditions<K extends { id?: PrimaryKey }>(
  store: K[],
  conditions: Record<string, any>
) {
  const [entry] = findByConditions(store, conditions);

  return entry
    ? {
        ...entry,
        toDto() {
          return (entry as any).toDto?.() || this;
        },
      }
    : null;
}

export const findFilter = (store: any[], _conditions: any) =>
  store.filter((entry: any) => {
    let atLeastOneKeyFound = false;

    const objectEntries = Object.entries(_conditions);

    const isValid = objectEntries.reduce((acc, [key, value]) => {
      if (!atLeastOneKeyFound) {
        atLeastOneKeyFound = Array.isArray(entry)
          ? entry.length > 0 && key in entry[0]
          : key in entry;
      }

      const bool = compare(entry[key], value);

      acc = acc && bool;

      return acc;
    }, true);

    // reset to false if no key was found
    // throughout the iteration. This will
    // prevent the scenario where the search
    // object contains nothing but keys that do
    // not exist in the entries being searched.
    return objectEntries.length ? atLeastOneKeyFound && isValid : isValid;
  });

export function findByConditions<K extends { id?: PrimaryKey }>(
  store: K[],
  conditions: Record<string, any> | Record<string, any>[]
) {
  const isArray = Array.isArray(conditions);

  const filteredStore = store.filter(isDeleted as (value: K) => boolean);

  let entries: K[];

  if (isArray) {
    const records: K[] = conditions
      .map(({ deletedAt: _, ...rest }) => {
        const result = findFilter(filteredStore, rest);

        return result;
      })
      .flat();

    const set = new Set(records);

    entries = Array.from(set);
  } else {
    const { deletedAt: _, ...rest } = conditions;
    entries = findFilter(filteredStore, rest);
  }

  return entries.map((entry) => {
    const instance = plainToInstance((store as any).entityName, entry);

    (instance as any).toDto = () => instance;

    return instance as K;
  });
}

function isNull(value: any): boolean {
  return value === null || value === undefined;
}

function compareArray(left: any[], right: any): boolean {
  return typeof right === 'undefined' || isNull(right)
    ? true
    : left.some((entry) => compare(entry, right));
}

function compareFindOperator(left: any, right: FindOperator<any>): boolean {
  const { type, value: operatorValue } = right;

  switch (type) {
    case 'in':
      return (operatorValue as any[]).includes(left);

    case 'ilike':
      return compareILike(left, operatorValue);

    case 'isNull':
      return isNull(left);

    case 'not':
      return compareNot(left, operatorValue);

    case 'between':
      return compareBetween(left, operatorValue);

    case 'raw':
      return true;

    default:
      return false;
  }
}

function compareILike(left: any, operatorValue: any): boolean {
  let expression = `${operatorValue}`;
  const startsWith = expression.startsWith('%');
  const endsWith = expression.endsWith('%');

  if (startsWith && endsWith) {
    expression = expression.replace(/%/g, '');
  } else if (startsWith) {
    expression = expression.replace('%', '^');
  } else if (endsWith) {
    expression = expression.replace('%', '$');
  }

  const regex = new RegExp(expression, 'i');
  return !!regex.exec(`${left}`);
}

function compareNot(left: any, operatorValue: any): boolean {
  if (operatorValue instanceof FindOperator) {
    return operatorValue.type === 'isNull'
      ? !isNull(left)
      : left !== operatorValue.value;
  }
  return left !== operatorValue;
}

function compareBetween(left: any, operatorValue: any): boolean {
  let [lower, upper] = operatorValue as any[];

  if (typeof left === 'string') {
    // Convert date objects into string representation
    lower = lower.toJSON?.() || lower;
    upper = upper.toJSON?.() || upper;
  }

  return left >= lower && left <= upper;
}

function compareObject(left: any, right: Record<string, any>): boolean {
  return Object.entries(right).every(([key, value]) => {
    if (typeof left !== 'object') {
      return false;
    }
    return compare(left[key], value);
  });
}

function compare(left: any, right: any): boolean {
  if (Array.isArray(left)) {
    return compareArray(left, right);
  }

  // typeORM strips out keys with null | undefined values
  if (!left || typeof right === 'undefined' || isNull(right)) return true;

  if (right instanceof FindOperator) {
    return compareFindOperator(left, right);
  }

  if (typeof right === 'object') {
    return compareObject(left, right);
  }

  if (typeof left === 'boolean') {
    return Boolean(left) === Boolean(right);
  }

  return left === right;
}

export function isDeleted<Entity>(
  record: Entity extends { deletedAt?: Date }
    ? Entity
    : Entity & { deletedAt?: Date }
) {
  return !record.deletedAt;
}

export const getQueryBuilderProxy = () => {
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        if (
          ['execute', 'getMany', 'getRawMany', 'getOne'].includes(prop as any)
        ) {
          return async () => (prop === 'execute' ? { raw: [] } : []);
        }

        return () => proxy;
      },
    }
  );

  return proxy;
};

export const mockClassMethods = <T extends { prototype: any }>(
  serviceClass: T,
  methods: (keyof T['prototype'])[]
) => {
  const mockObj: Record<string, jest.Mock> = {};

  methods.forEach((method) => {
    mockObj[method as string] = jest.fn();
  });

  return {
    provide: serviceClass,
    useValue: { ...serviceClass.prototype, ...(mockObj as any) },
  };
};

export function createFn<T>(entity: T): T;
export function createFn<T, K>(target: T, entity: K): K;
export function createFn<T, K>(target: T, entity?: K): K {
  if (entity === undefined) {
    throw new Error('Entity cannot be undefined');
  }
  return entity;
}
