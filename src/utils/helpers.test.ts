import { valueOrEmpty } from './helpers';

describe('Helpers', () => {
  describe('valueOrEmpty', () => {
    it('should return value if no placeholderChars are present', () => {
      const value = '+7 (999) 888-77-66';

      expect(valueOrEmpty(value, '_')).toEqual(value);
    });

    it('should return empty string if placeholderChars are present', () => {
      const value = '+7 (999) 888-7_-66';

      expect(valueOrEmpty(value, '_')).toEqual('');
    });
  });
});
