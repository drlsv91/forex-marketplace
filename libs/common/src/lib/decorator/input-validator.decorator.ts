import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const dateValue = new Date(value).toISOString().split('T')[0];
          const now = new Date().toISOString().split('T')[0];
          return dateValue >= now;
        },
      },
    });
  };
}

export function IsCurrencyPair(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCurrencyPair',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string' || value.length > 22) return false;
          const formattedValue = value.toUpperCase().replace(/\s/g, '');
          return /^[A-Z]{3}\/[A-Z]{3}$/.test(formattedValue);
        },
        defaultMessage() {
          return 'Currency pair must be in format XXX/YYY (e.g., USD/EUR)';
        },
      },
      constraints: [],
    });
  };
}

export function TransformCurrencyPair() {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      get: function () {
        return this[`__${key}`];
      },
      set: function (value: string) {
        this[`__${key}`] = value.toUpperCase().replace(/\s/g, '');
      },
      enumerable: true,
      configurable: true,
    });
  };
}

export function IsCurrency(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCurrency',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string' || value.length > 10) return false;
          const formattedValue = value.toUpperCase().replace(/\s/g, '');
          return /^[A-Z]{3}$/.test(formattedValue);
        },
        defaultMessage() {
          return 'Currency must be in format XXX (e.g., USD, EUR, GBP)';
        },
      },
      constraints: [],
    });
  };
}

// Transformer function for class-transformer
export function TransformCurrency() {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      get: function () {
        return this[`__${key}`];
      },
      set: function (value: string) {
        this[`__${key}`] = value.toUpperCase().replace(/\s/g, '');
      },
      enumerable: true,
      configurable: true,
    });
  };
}
