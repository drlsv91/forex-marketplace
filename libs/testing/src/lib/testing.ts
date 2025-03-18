import { plainToInstance } from 'class-transformer';
import { EntityTarget } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Dto, PrimaryKey, StoreKey } from './types';
import {
  findByConditions,
  findFilter,
  findOneByConditions,
  getQueryBuilderProxy,
  saveRecord,
} from './utils';

export const CONNECTION = 'CONNECTION';

const createStores = <K>() => new Map<EntityTarget<K>, K[]>();
const stores = createStores<any>();

export const getRepositoryMethods = <Entity extends Dto>(
  name: EntityTarget<Entity>
) => {
  return {
    count: jest
      .fn()
      .mockImplementation(
        async ({ where }: { where: Record<string, unknown> }) => {
          const store = getStore(name as StoreKey);
          const results = findByConditions<Entity>(store, where);
          return results.length;
        }
      ),

    countBy: jest
      .fn()
      .mockImplementation(async (conditions: Record<string, unknown>) => {
        const store = getStore(name as StoreKey);
        const results = findByConditions<Entity>(store, conditions);
        return results.length;
      }),

    create: jest.fn().mockImplementation((record: Partial<Entity>) => {
      const instance: any = plainToInstance(name as any, record);
      instance.id = instance.id || uuidv4();
      instance.toDto = () => instance;
      instance.createdAt = new Date();
      instance.updatedAt = new Date();
      return instance;
    }),

    save: jest.fn().mockImplementation(async (record: Entity | Entity[]) => {
      const store = getStore(name as StoreKey);
      const records = Array.isArray(record) ? record : [record];
      const savedRecords = records.map((record) => {
        if (record.id) {
          const index = store.findIndex((x) => x.id === record.id);
          if (index !== -1) {
            Object.assign(store[index], record);
            return store[index];
          }
        }
        return saveRecord(store, record);
      });
      return Array.isArray(record) ? savedRecords : savedRecords[0];
    }),

    existsBy: jest
      .fn()
      .mockImplementation(async (conditions: Record<string, any>) => {
        const store = getStore(name as StoreKey);
        return !!findOneByConditions<Entity>(store, conditions);
      }),

    find: jest
      .fn()
      .mockImplementation(
        async (conditions: { where?: Record<string, any> } = {}) => {
          const store = getStore(name as StoreKey);
          return findByConditions<Entity>(store, conditions.where || {});
        }
      ),

    findBy: jest
      .fn()
      .mockImplementation(async (conditions: Record<string, any>) => {
        const store = getStore(name as StoreKey);
        return findByConditions<Entity>(store, conditions);
      }),

    findAndCount: jest
      .fn()
      .mockImplementation(async ({ where }: { where: Record<string, any> }) => {
        const store = getStore(name as StoreKey);
        const results = findByConditions<Entity>(store, where || {});
        return [results, results.length];
      }),

    findOne: jest
      .fn()
      .mockImplementation(
        async ({ where = {} }: { where?: Record<string, any> }) => {
          const store = getStore(name as StoreKey);
          return findOneByConditions(store, where);
        }
      ),

    findOneBy: jest
      .fn()
      .mockImplementation(async (conditions: Record<string, any>) => {
        const store = getStore(name as StoreKey);
        return findOneByConditions<Entity>(store, conditions);
      }),

    update: jest
      .fn()
      .mockImplementation(
        async (
          idOrWhere: PrimaryKey | Record<string, any>,
          record: Partial<Entity>
        ) => {
          const store = getStore(name as StoreKey);
          if (typeof idOrWhere === 'string' || typeof idOrWhere === 'number') {
            const index = store.findIndex((x) => x.id === idOrWhere);
            if (index === -1) throw new Error('Record not found');
            Object.assign(store[index], record);
            return store[index];
          }

          const entries = findFilter(store, idOrWhere);
          entries.forEach((entry) => {
            Object.assign(entry, record);
          });
          return entries;
        }
      ),

    remove: jest.fn().mockImplementation(async (records: Entity | Entity[]) => {
      const store = getStore(name as StoreKey);
      const recordsArray = Array.isArray(records) ? records : [records];
      const removedRecords = recordsArray.map((record) => {
        const index = store.findIndex((x) => x.id === record.id);
        if (index === -1) throw new Error('Record not found');
        return store.splice(index, 1)[0];
      });
      return Array.isArray(records) ? removedRecords : removedRecords[0];
    }),

    softRemove: jest
      .fn()
      .mockImplementation(async (records: Entity | Entity[]) => {
        const store = getStore(name as StoreKey);
        const recordsArray = Array.isArray(records) ? records : [records];
        const softRemovedRecords = recordsArray.map((record) => {
          const index = store.findIndex((x) => x.id === record.id);
          if (index === -1) throw new Error('Record not found');
          store[index].deletedAt = new Date();
          return store[index];
        });
        return Array.isArray(records)
          ? softRemovedRecords
          : softRemovedRecords[0];
      }),

    softDelete: jest
      .fn()
      .mockImplementation(
        async (criteria: PrimaryKey | PrimaryKey[] | Record<string, any>) => {
          const store = getStore(name as StoreKey);
          const criteriaArray = Array.isArray(criteria) ? criteria : [criteria];
          criteriaArray.forEach((c) => {
            const item = store.find(
              (x) => x.id === (typeof c === 'object' ? c.id : c)
            );
            if (item) item.deletedAt = new Date();
          });
          return criteriaArray.length;
        }
      ),

    delete: jest
      .fn()
      .mockImplementation(async (ids: PrimaryKey | PrimaryKey[]) => {
        const store = getStore(name as StoreKey);
        const idsArray = Array.isArray(ids) ? ids : [ids];
        const deletedRecords = idsArray.map((id) => {
          const index = store.findIndex((x) => x.id === id);
          if (index === -1) throw new Error('Record not found');
          return store.splice(index, 1)[0];
        });
        return Array.isArray(ids) ? deletedRecords : deletedRecords[0];
      }),

    manager: {
      transaction: async (...args: [any, any?]) => {
        const fn: (entityManager: any) => Promise<any> =
          args.length > 1 ? args[1] : args[0];
        const methods = getTransactionManagerMethods(name as any);
        return await fn(methods);
      },
    },

    createQueryBuilder: jest
      .fn()
      .mockImplementation(() => getQueryBuilderProxy()),
  };
};

export const getTransactionManagerMethods = (name: string) => {
  const repositoryMethods = getRepositoryMethods(name);
  const methods = Object.entries(repositoryMethods).reduce(
    (acc, [key, func]) => {
      if (key === 'manager') {
        acc['manager'] = func;
      } else {
        if (['save', 'remove', 'softRemove'].includes(key)) {
          const newFunction = <K>(obj: K | K[], ...args: any[]) => {
            if (!Array.isArray(obj)) {
              if (stores.has(obj as any)) {
                const newObj = args.shift();
                obj = [Object.assign(new (obj as any)(), newObj)];
              } else obj = [obj];
            }

            if (!obj.length) return;

            const objType = Array.from(stores.keys()).find((key: any) => {
              return obj[0] instanceof key;
            });

            if (!objType) return;

            const _fn =
              getRepositoryMethods(objType)[
                key as keyof ReturnType<typeof getRepositoryMethods>
              ];
            if (typeof _fn === 'function') {
              return _fn(obj, ...args);
            }
            throw new Error('The resolved function is not callable');
          };
          acc[key as keyof typeof repositoryMethods] = newFunction;
        } else {
          const newFunction = (name: any, ...args: any[]) => {
            const _fn =
              getRepositoryMethods(name)[
                key as keyof ReturnType<typeof getRepositoryMethods>
              ];
            if (typeof _fn === 'function') {
              return _fn(...args);
            }
            throw new Error('The resolved function is not callable');
          };
          acc[key as keyof typeof repositoryMethods] = newFunction;
        }
      }

      return acc;
    },
    {} as Record<keyof typeof repositoryMethods, any>
  );

  return methods;
};

function getStore<T = any>(key: StoreKey): T[] {
  return stores.get(key as EntityTarget<any>) || [];
}

export const getMockedConnectionProvider = <Entity extends Dto>(
  target: EntityTarget<Entity>,
  store: Entity[]
) => {
  if (!stores.has(target)) {
    store.constructor.prototype.entityName = target;
    stores.set(target, store);
  }

  return {
    provide: CONNECTION,
    useValue: {
      getRepository(target: EntityTarget<Entity>) {
        return getRepositoryMethods(target);
      },
      transaction: (...args: [any, any?]) => {
        const methods = getRepositoryMethods(target);
        return methods.manager.transaction(...args);
      },
      manager: getTransactionManagerMethods(target as unknown as string),
    },
  };
};
