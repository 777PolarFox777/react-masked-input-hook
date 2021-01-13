import type { Diff } from 'fast-diff';
import diff from 'fast-diff';

export interface FormatChars {
  [x: string]: string,
}

export interface ApplyMaskArgs {
  mask: string,
  value: string | null,
  placeholderChar: string,
  formatChars: FormatChars,
}

export interface RemoveCharsArgs {
  mask: string,
  placeholderChar: string,
  formatChars: FormatChars,
  inputElement: HTMLInputElement,
  onChange: (value: string) => void,
  valueDiff: Diff[],
}

export interface ReplaceCharsArgs {
  mask: string,
  placeholderChar: string,
  formatChars: FormatChars,
  inputElement: HTMLInputElement,
  onChange: (value: string) => void,
  chars: string,
}

export interface InputCharArgs {
  mask: string,
  placeholderChar: string,
  formatChars: FormatChars,
  inputElement: HTMLInputElement,
  onChange: (value: string) => void,
  char: string,
}

export const applyMask = (args: ApplyMaskArgs) => {
  const {
    mask, value, placeholderChar, formatChars,
  } = args;

  if (value == null) {
    return mask.split('').map((char) => {
      if (char in formatChars && formatChars[char]) {
        // editable
        return placeholderChar;
      }

      // non editable
      return char;
    }).join('');
  }

  let tempValue = value;

  return mask.split('').map((char) => {
    let valueChar = tempValue[0];

    if (char === valueChar) {
      tempValue = tempValue.slice(1);

      return char;
    }

    const formatCharRule = formatChars[char];

    if (formatCharRule) {
      while (tempValue.length) {
        const isMatch = valueChar && new RegExp(formatCharRule).test(valueChar);
        tempValue = tempValue.slice(1);

        if (valueChar === placeholderChar) {
          return placeholderChar;
        }

        if (isMatch) {
          return valueChar;
        }

        // eslint-disable-next-line prefer-destructuring
        valueChar = tempValue[0];
      }

      return placeholderChar;
    }

    // non editable
    // slice until meet non editable char from mask
    while (tempValue.length && valueChar !== char) {
      tempValue = tempValue.slice(1);

      // eslint-disable-next-line prefer-destructuring
      valueChar = tempValue[0];
    }

    return char;
  }).join('');
};

export const removeChars = (args: RemoveCharsArgs) => {
  const {
    inputElement, mask, placeholderChar, formatChars, onChange, valueDiff,
  } = args;

  const removeDiffIndex = valueDiff.findIndex((item) => item[0] === diff.DELETE);

  if (removeDiffIndex === -1) {
    // chars were not removed
    return;
  }

  const [, removedChars = ''] = valueDiff[removeDiffIndex] ?? [];

  const removeStart = valueDiff.slice(0, removeDiffIndex).map((item) => item[1]).join('').length;
  const removeEnd = removeStart + removedChars.length;

  if (removedChars === placeholderChar) {
    const newCursorPosition = inputElement.selectionStart ?? 0;
    inputElement.setSelectionRange(newCursorPosition - 1, newCursorPosition - 1);

    return;
  }

  const newValue = valueDiff.reduce((acc, item) => {
    const [type, chars] = item;

    if (type === diff.EQUAL) {
      return acc + chars;
    }

    if (type === diff.DELETE) {
      // replace each editable char to placeholderChar
      const maskPart = mask.slice(removeStart, removeEnd);

      return acc + maskPart.split('').map((char, index) => {
        if (formatChars[char]) {
          // editable
          // fill with placeholder chars
          return placeholderChar;
        }

        return chars[index] ?? '';
      }).join('');
    }

    return acc;
  }, '');

  inputElement.value = newValue;
  onChange(newValue);

  inputElement.setSelectionRange(removeStart, removeStart);
};

export const replaceChars = (args: ReplaceCharsArgs) => {
  const {
    inputElement, mask, placeholderChar, formatChars, onChange, chars,
  } = args;

  const { value } = inputElement;

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const isRange = !!(selectionEnd - selectionStart);

  let charsToInsert = chars;

  const newValue = value.split('').map((valueChar, index) => {
    const condition = isRange
      ? index >= selectionStart && index <= selectionEnd
      : index >= selectionStart && valueChar === placeholderChar;

    const maskChar = mask[index];

    const rule = maskChar ? formatChars[maskChar] : null;

    if (!rule) {
      if (valueChar === charsToInsert[0]) {
        charsToInsert = charsToInsert.slice(1);
      }
      // not editable
      return valueChar;
    }

    if (condition) {
      if (charsToInsert) {
        while (charsToInsert) {
          const topChar = charsToInsert[0];

          const isMatch = rule && topChar ? new RegExp(rule).test(topChar) : false;

          charsToInsert = charsToInsert.slice(1);

          if (isMatch) {
            return topChar;
          }
        }

        return placeholderChar;
      }

      return placeholderChar;
    }

    return valueChar;
  }).join('');

  inputElement.value = newValue;
  onChange(newValue);

  const placeholderCharIndex = newValue.indexOf(placeholderChar);

  const newCursorPosition = placeholderCharIndex === -1 ? newValue.length : placeholderCharIndex;
  // move cursor by number of inserted symbols
  inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
};

export const inputChar = (args: InputCharArgs) => {
  const {
    inputElement, char, mask, placeholderChar, formatChars, onChange,
  } = args;

  const { value } = inputElement;

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const isRange = !!(selectionEnd - selectionStart);

  if (isRange) {
    replaceChars({
      ...args,
      chars: char,
    });

    return;
  }

  // chars were added
  const valuePart = selectionStart === 0 ? value : value.slice(selectionStart - 1);

  const placeholderCharIndex = valuePart.indexOf(placeholderChar);

  if (placeholderCharIndex === -1) {
    return;
  }

  const insertIndex = selectionStart === 0
    ? placeholderCharIndex
    : (selectionStart - 1) + placeholderCharIndex;

  const maskChar = mask[insertIndex];

  const rule = maskChar ? formatChars[maskChar] : null;

  const isMatch = rule ? new RegExp(rule).test(char) : false;

  if (!isMatch) {
    return;
  }

  const newValue = value.slice(0, insertIndex)
      + char + value.slice(insertIndex + 1);

  const newCursorPosition = insertIndex + 1;

  inputElement.value = newValue;
  inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
  onChange(newValue);
};
