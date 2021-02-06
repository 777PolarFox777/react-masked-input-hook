import { applyMask, removeChars, replaceChars } from './mask';
import { defaultFormatChars, RemoveDirection } from './constants';

describe('Mask', () => {
  const baseArgs = {
    mask: '+7 (###) ###-##-##',
    placeholderChar: '_',
    formatChars: defaultFormatChars,
  };

  describe('applyMask', () => {
    it('should applyMask with default values', () => {
      const args = { ...baseArgs, value: '9998887766' };

      expect(applyMask(args)).toEqual('+7 (999) 888-77-66');
    });

    it('should apply mask with null value', () => {
      const args = { ...baseArgs, value: null };

      expect(applyMask(args)).toEqual('+7 (___) ___-__-__');
    });

    it('should apply value partially', () => {
      const args = { ...baseArgs, value: '999888' };

      expect(applyMask(args)).toEqual('+7 (999) 888-__-__');
    });

    it('should apply value that start with static symbols', () => {
      const args = { ...baseArgs, value: '+79998887766' };

      expect(applyMask(args)).toEqual('+7 (999) 888-77-66');
    });

    it('should apply identical value', () => {
      const args = { ...baseArgs, value: '+7 (999) 888-77-66' };

      expect(applyMask(args)).toEqual('+7 (999) 888-77-66');
    });

    it('should skip incorrect characters', () => {
      const args = { ...baseArgs, value: '+7--999---888 77      66' };

      expect(applyMask(args)).toEqual('+7 (999) 888-77-66');
    });

    it('should skip placeholder chars', () => {
      const args = { ...baseArgs, value: '+7___8887766' };

      expect(applyMask(args)).toEqual('+7 (___) 888-77-66');
    });
  });

  describe('removeChars', () => {
    const onChange = jest.fn();
    const value = '+7 (999) 888-77-66';
    const inputElement = {
      value,
      selectionStart: 0,
      selectionEnd: 0,
      setSelectionRange: jest.fn(),
    };

    afterEach(() => {
      jest.clearAllMocks();
      inputElement.value = value;
      inputElement.selectionStart = 0;
      inputElement.selectionEnd = 0;
    });

    describe('Backspace', () => {
      it('should remove character from left', () => {
        const args = {
          ...baseArgs,
          inputElement: inputElement as unknown as HTMLInputElement,
          onChange,
          direction: RemoveDirection.Left,
        };

        inputElement.selectionStart = value.length;
        inputElement.selectionEnd = value.length;

        removeChars(args);

        expect(inputElement.value).toEqual('+7 (999) 888-77-6_');
        expect(onChange).toHaveBeenCalledWith('+7 (999) 888-77-6_');
        expect(inputElement.setSelectionRange)
          .toHaveBeenCalledWith(value.length - 1, value.length - 1);
      });

      it('should not remove static chars', () => {
        const args = {
          ...baseArgs,
          inputElement: inputElement as unknown as HTMLInputElement,
          onChange,
          direction: RemoveDirection.Left,
        };

        inputElement.selectionStart = 4;
        inputElement.selectionEnd = 4;

        removeChars(args);

        expect(inputElement.value).toEqual('+7 (999) 888-77-66');
        expect(onChange).not.toHaveBeenCalled();
        expect(inputElement.setSelectionRange)
          .toHaveBeenCalledWith(4, 4);
      });

      it('should remove range', () => {
        const args = {
          ...baseArgs,
          inputElement: inputElement as unknown as HTMLInputElement,
          onChange,
          direction: RemoveDirection.Left,
        };

        inputElement.selectionStart = 3;
        inputElement.selectionEnd = 12;

        removeChars(args);

        const expectedValue = '+7 (___) ___-77-66';
        const expectedCursorPosition = expectedValue.indexOf(baseArgs.placeholderChar);

        expect(inputElement.value).toEqual(expectedValue);
        expect(onChange).toHaveBeenCalledWith(expectedValue);
        expect(inputElement.setSelectionRange)
          .toHaveBeenCalledWith(expectedCursorPosition, expectedCursorPosition);
      });
    });

    describe('Delete', () => {
      it('should remove character from right', () => {
        const args = {
          ...baseArgs,
          inputElement: inputElement as unknown as HTMLInputElement,
          onChange,
          direction: RemoveDirection.Right,
        };

        inputElement.selectionStart = value.length - 1;
        inputElement.selectionEnd = value.length - 1;

        removeChars(args);

        expect(inputElement.value).toEqual('+7 (999) 888-77-6_');
        expect(onChange).toHaveBeenCalledWith('+7 (999) 888-77-6_');
        expect(inputElement.setSelectionRange)
          .toHaveBeenCalledWith(value.length, value.length);
      });

      it('should not remove static chars', () => {
        const args = {
          ...baseArgs,
          mask: '###-###-US',
          inputElement: inputElement as unknown as HTMLInputElement,
          onChange,
          direction: RemoveDirection.Right,
        };

        const tempValue = '123-456-US';

        inputElement.value = tempValue;
        inputElement.selectionStart = tempValue.length - 3;
        inputElement.selectionEnd = tempValue.length - 3;

        removeChars(args);

        expect(inputElement.value).toEqual('123-456-US');
        expect(onChange).not.toHaveBeenCalled();
        expect(inputElement.setSelectionRange)
          .toHaveBeenCalledWith(tempValue.length - 3, tempValue.length - 3);
      });

      it('should remove range', () => {
        const args = {
          ...baseArgs,
          inputElement: inputElement as unknown as HTMLInputElement,
          onChange,
          direction: RemoveDirection.Right,
        };

        inputElement.selectionStart = 3;
        inputElement.selectionEnd = 13;

        removeChars(args);

        const expectedValue = '+7 (___) ___-77-66';
        const expectedCursorPosition = expectedValue.lastIndexOf(baseArgs.placeholderChar) + 1;

        expect(inputElement.value).toEqual(expectedValue);
        expect(onChange).toHaveBeenCalledWith(expectedValue);
        expect(inputElement.setSelectionRange)
          .toHaveBeenCalledWith(expectedCursorPosition, expectedCursorPosition);
      });
    });

    it('should accept incorrect direction', () => {
      const args = {
        ...baseArgs,
        inputElement: inputElement as unknown as HTMLInputElement,
        onChange,
        direction: 3,
      };

      inputElement.selectionStart = value.length;
      inputElement.selectionEnd = value.length;

      removeChars(args);

      expect(inputElement.value).toEqual('+7 (999) 888-77-66');
      expect(onChange).not.toHaveBeenCalled();
      expect(inputElement.setSelectionRange)
        .toHaveBeenCalledWith(value.length, value.length);
    });
  });

  describe('replaceChars', () => {
    const onChange = jest.fn();
    const value = '+7 (999) 888-77-66';
    const inputElement = {
      value,
      selectionStart: 0,
      selectionEnd: 0,
      setSelectionRange: jest.fn(),
    };

    it('should do nothing when selection is not a range', () => {
      const args = {
        ...baseArgs,
        inputElement: inputElement as unknown as HTMLInputElement,
        onChange,
        chars: '',
      };

      inputElement.selectionStart = value.length;
      inputElement.selectionEnd = value.length;

      replaceChars(args);

      expect(inputElement.value).toEqual('+7 (999) 888-77-66');
      expect(onChange).not.toHaveBeenCalled();
      expect(inputElement.setSelectionRange)
        .not.toHaveBeenCalled();
    });

    it('should not insert incorrect character', () => {
      const args = {
        ...baseArgs,
        inputElement: inputElement as unknown as HTMLInputElement,
        onChange,
        chars: 'A',
      };

      inputElement.selectionStart = 3;
      inputElement.selectionEnd = 12;

      replaceChars(args);

      const expectedValue = '+7 (___) ___-77-66';
      const expectedCursorPosition = expectedValue.indexOf(baseArgs.placeholderChar);

      expect(inputElement.value).toEqual(expectedValue);
      expect(onChange).toHaveBeenCalledWith(expectedValue);
      expect(inputElement.setSelectionRange)
        .toHaveBeenCalledWith(expectedCursorPosition, expectedCursorPosition);
    });

    it('should insert single character', () => {
      const args = {
        ...baseArgs,
        inputElement: inputElement as unknown as HTMLInputElement,
        onChange,
        chars: '1',
      };

      inputElement.selectionStart = 3;
      inputElement.selectionEnd = 12;

      replaceChars(args);

      const expectedValue = '+7 (1__) ___-77-66';
      const expectedCursorPosition = expectedValue.indexOf(baseArgs.placeholderChar);

      expect(inputElement.value).toEqual(expectedValue);
      expect(onChange).toHaveBeenCalledWith(expectedValue);
      expect(inputElement.setSelectionRange)
        .toHaveBeenCalledWith(expectedCursorPosition, expectedCursorPosition);
    });

    it('should insert multiple characters', () => {
      const args = {
        ...baseArgs,
        inputElement: inputElement as unknown as HTMLInputElement,
        onChange,
        chars: '123',
      };

      inputElement.selectionStart = 3;
      inputElement.selectionEnd = 12;

      replaceChars(args);

      const expectedValue = '+7 (123) ___-77-66';
      const expectedCursorPosition = expectedValue.indexOf(baseArgs.placeholderChar);

      expect(inputElement.value).toEqual(expectedValue);
      expect(onChange).toHaveBeenCalledWith(expectedValue);
      expect(inputElement.setSelectionRange)
        .toHaveBeenCalledWith(expectedCursorPosition, expectedCursorPosition);
    });

    it('should insert not editable characters', () => {
      const args = {
        ...baseArgs,
        inputElement: inputElement as unknown as HTMLInputElement,
        onChange,
        chars: '(123',
      };

      inputElement.selectionStart = 3;
      inputElement.selectionEnd = 12;

      replaceChars(args);

      const expectedValue = '+7 (123) ___-77-66';
      const expectedCursorPosition = expectedValue.indexOf(baseArgs.placeholderChar);

      expect(inputElement.value).toEqual(expectedValue);
      expect(onChange).toHaveBeenCalledWith(expectedValue);
      expect(inputElement.setSelectionRange)
        .toHaveBeenCalledWith(expectedCursorPosition, expectedCursorPosition);
    });
  });
});
