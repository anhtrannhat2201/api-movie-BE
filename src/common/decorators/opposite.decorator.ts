import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClassConstructor } from 'class-transformer';

export const Opposite = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: OppositeConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'Opposite' })
export class OppositeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [fn] = args.constraints;
    return fn(args.object) === !value;
  }

  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: Array<() => any> = args.constraints;
    return `If ${(constraintProperty + '').split('.')[1]} is true, then ${
      args.property
    } must be false, and vice versa`;
  }
}

// USAGE:
// @Match(MovieEntity, (s) => s.dangChieu)
// sapChieu: boolean;
