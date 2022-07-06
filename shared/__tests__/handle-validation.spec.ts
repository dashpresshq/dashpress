import { isBoolean, maxLength } from 'class-validator';
import { handleValidation } from '../validations.constants/handle-validation';
import { ENTITY_VALIDATION_CONFIG } from '../validations.constants';

describe('Handle Validation', () => {
  it('should return error message when validation expectation are not met', () => {
    expect(handleValidation(isBoolean)('false', 'Error Message', {}, {})).toBe('Error Message');
  });

  it('should return undefined when validations expectation are met', () => {
    expect(handleValidation(isBoolean)(false, 'Error Message', {}, {})).toBeUndefined();
  });

  it('should not run validations when values are falsy', () => {
    expect(handleValidation(isBoolean)('', 'Error Message', {}, {})).toBeUndefined();
    expect(handleValidation(isBoolean)(undefined, 'Error Message', {}, {})).toBeUndefined();
  });

  it('should run validation for those that require paramets', () => {
    expect(
      handleValidation(maxLength, 'length')('should error out', 'Error Message', { length: 5 }, {}),
    ).toBe('Error Message');
    expect(
      handleValidation(maxLength, 'length')('less5', 'Error Message', { length: 5 }, {}),
    ).toBeUndefined();
  });
});

describe('Validation Checks', () => {
  it('should check required correctly', () => {
    expect(ENTITY_VALIDATION_CONFIG.required.implementation('', 'Error Message', {}, {})).toBe(
      'Error Message',
    );

    expect(
      ENTITY_VALIDATION_CONFIG.required.implementation('dddd', 'Error Message', {}, {}),
    ).toBeUndefined();
  });
});
