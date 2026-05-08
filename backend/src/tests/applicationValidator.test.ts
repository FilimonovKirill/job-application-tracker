import {
  createApplicationSchema,
  updateApplicationSchema,
} from '../validators/applicationValidator';

describe('Application Validator', () => {
  describe('createApplicationSchema', () => {
    it('should validate a valid application', () => {
      const validApp = {
        company: 'Google',
        role: 'Engineer',
        workType: 'remote',
      };
      const { error } = createApplicationSchema.validate(validApp);
      expect(error).toBeUndefined();
    });

    it('should fail if company is missing', () => {
      const invalidApp = {
        role: 'Engineer',
      };
      const { error } = createApplicationSchema.validate(invalidApp);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"company" is required');
    });

    it('should fail if workType is invalid', () => {
      const invalidApp = {
        company: 'Google',
        role: 'Engineer',
        workType: 'invalid',
      };
      const { error } = createApplicationSchema.validate(invalidApp);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        '"workType" must be one of [remote, on-site, hybrid]'
      );
    });
  });

  describe('updateApplicationSchema', () => {
    it('should validate a partial update', () => {
      const partialUpdate = {
        company: 'Updated Google',
      };
      const { error } = updateApplicationSchema.validate(partialUpdate);
      expect(error).toBeUndefined();
    });

    it('should fail if role is too long', () => {
      const invalidUpdate = {
        role: 'a'.repeat(201),
      };
      const { error } = updateApplicationSchema.validate(invalidUpdate);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        '"role" length must be less than or equal to 200 characters long'
      );
    });
  });
});
