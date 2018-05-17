import { validateTypes } from './validate'

describe('validateTypes', () => {

  describe('string handling', () => {
    it('should handle valid strings', () =>
      expect(() => validateTypes(
        { aString: 'stringValue' },
        { aString: 'string' },
      )).not.toThrow())

    it('should fail on missing', () =>
      expect(() => validateTypes(
        {},
        { aString: 'string' },
      )).toThrow())

    it('should fail on null', () =>
      expect(() => validateTypes(
        { aString: null },
        { aString: 'string' },
      )).toThrow())

    it('should fail on undefined', () =>
      expect(() => validateTypes(
        { aString: undefined },
        { aString: 'string' },
      )).toThrow())

    it('should fail on object', () =>
      expect(() => validateTypes(
        { aString: { foo: 'bar' }},
        { aString: 'string' },
      )).toThrow())

    it('should fail on array', () =>
      expect(() => validateTypes(
        { aString: [1, 2, 3] },
        { aString: 'string' },
      )).toThrow())

    it('should fail on number', () =>
      expect(() => validateTypes(
        { aString: 5 },
        { aString: 'string' },
      )).toThrow())
  })

  describe('number handling', () => {
    it('should handle valid numbers', () =>
      expect(() => validateTypes(
        { aNumber: 5 },
        { aNumber: 'number' },
      )).not.toThrow())

    it('should fail on missing', () =>
      expect(() => validateTypes(
        {},
        { aNumber: 'number' },
      )).toThrow())

    it('should fail on null', () =>
      expect(() => validateTypes(
        { aNumber: null },
        { aNumber: 'number' },
      )).toThrow())

    it('should fail on undefined', () =>
      expect(() => validateTypes(
        { aNumber: undefined },
        { aNumber: 'number' },
      )).toThrow())

    it('should fail on object', () =>
      expect(() => validateTypes(
        { aNumber: { foo: 'bar' }},
        { aNumber: 'number' },
      )).toThrow())

    it('should fail on array', () =>
      expect(() => validateTypes(
        { aNumber: [1, 2, 3] },
        { aNumber: 'number' },
      )).toThrow())

    it('should fail on string', () =>
      expect(() => validateTypes(
        { aNumber: '5' },
        { aNumber: 'number' },
      )).toThrow())
  })

  describe('object handling', () => {
    it('should handle valid objects', () =>
      expect(() => validateTypes(
        { anObject: { foo: 'bar' } },
        { anObject: 'object' },
      )).not.toThrow())

    it('should fail on missing', () =>
      expect(() => validateTypes(
        {},
        { anObject: 'object' },
      )).toThrow())

    it('should fail on null', () =>
      expect(() => validateTypes(
        { anObject: null },
        { anObject: 'object' },
      )).toThrow())

    it('should fail on undefined', () =>
      expect(() => validateTypes(
        { anObject: undefined },
        { anObject: 'object' },
      )).toThrow())

    it('should fail on array', () =>
      expect(() => validateTypes(
        { anObject: [1, 2, 3] },
        { anObject: 'object' },
      )).toThrow())

    it('should fail on string', () =>
      expect(() => validateTypes(
        { anObject: '5' },
        { anObject: 'object' },
      )).toThrow())

    it('should fail on number', () =>
      expect(() => validateTypes(
        { anObject: 5 },
        { anObject: 'object' },
      )).toThrow())
  })

  describe('array handling', () => {
    it('should handle valid arrays', () =>
      expect(() => validateTypes(
        { anArray: [1, 2, 3, 4] },
        { anArray: 'array' },
      )).not.toThrow())

    it('should fail on missing', () =>
      expect(() => validateTypes(
        {},
        { anArray: 'array' },
      )).toThrow())

    it('should fail on null', () =>
      expect(() => validateTypes(
        { anArray: null },
        { anArray: 'array' },
      )).toThrow())

    it('should fail on undefined', () =>
      expect(() => validateTypes(
        { anArray: undefined },
        { anArray: 'array' },
      )).toThrow())

    it('should fail on object', () =>
      expect(() => validateTypes(
        { anArray: { foo: 'bar' } },
        { anArray: 'array' },
      )).toThrow())

    it('should fail on string', () =>
      expect(() => validateTypes(
        { anArray: '5' },
        { anArray: 'array' },
      )).toThrow())

    it('should fail on number', () =>
      expect(() => validateTypes(
        { anArray: 5 },
        { anArray: 'array' },
      )).toThrow())
  })

  it('should handle nested objects', () =>
    expect(() => validateTypes({
      aNumber: 5,
      aString: 'foo',
      anArray: [1, 2, 3],
      anObject: {
        aNumber: 5,
        aString: 'foo',
        anArray: [1, 2, 3],
      },
    }, {
      aNumber: 'number',
      aString: 'string',
      anArray: 'array',
      anObject: {
        aNumber: 'number',
        aString: 'string',
        anArray: 'array',
      },
    })).not.toThrow())
})
