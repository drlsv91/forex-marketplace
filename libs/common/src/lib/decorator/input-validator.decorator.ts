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
