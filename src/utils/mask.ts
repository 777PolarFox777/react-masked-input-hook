import { RemoveDirection } from './constants';

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
  direction: RemoveDirection,
}

export interface ReplaceCharsArgs {
  mask: string,
  placeholderChar: string,
  formatChars: FormatChars,
  inputElement: HTMLInputElement,
  onChange: (value: string) => void,
  chars: string,
}

export interface PasteCharsArgs {
  mask: string,
  placeholderChar: string,
  formatChars: FormatChars,
  inputElement: HTMLInputElement,
  onChange: (value: string) => void,
  chars: string,
}

export interface CutCharsArgs {
  mask: string,
  placeholderChar: string,
  formatChars: FormatChars,
  inputElement: HTMLInputElement,
  onChange: (value: string) => void,
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
    return char;
  }).join('');
};

export const removeChars = (args: RemoveCharsArgs) => {
  const {
    inputElement, mask, placeholderChar, formatChars, onChange, direction,
  } = args;

  const { value } = inputElement;

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const isRange = !!(selectionEnd - selectionStart);

  if (isRange) {
    const newValue = value.split('').map((valueChar, index) => {
      const maskChar = mask[index];

      const rule = maskChar ? formatChars[maskChar] : null;

      if (!rule) {
        // not editable
        return valueChar;
      }

      if (index >= selectionStart && index < selectionEnd) {
        return placeholderChar;
      }

      return valueChar;
    }).join('');

    inputElement.value = newValue;
    onChange(newValue);

    const placeholderCharIndex = direction === RemoveDirection.Left
      ? selectionStart
        + newValue.slice(selectionStart, selectionEnd).indexOf(placeholderChar)
      : selectionStart
        + newValue.slice(selectionStart, selectionEnd).lastIndexOf(placeholderChar) + 1;

    const newCursorPosition = placeholderCharIndex === -1 ? newValue.length : placeholderCharIndex;
    // move cursor by number of inserted symbols
    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);

    return;
  }

  const nextEditableIndex = (() => {
    if (direction === RemoveDirection.Left) {
      const maskPart = mask.slice(0, selectionStart);

      const lastEditableReversed = maskPart.split('').reverse().findIndex((char) => formatChars[char]);

      if (lastEditableReversed === -1) {
        return -1;
      }

      return (maskPart.length - 1) - lastEditableReversed;
    }

    if (direction === RemoveDirection.Right) {
      const maskPart = mask.slice(selectionStart);

      const lastEditable = maskPart.split('').findIndex((char) => formatChars[char]);

      if (lastEditable === -1) {
        return -1;
      }

      return selectionStart + lastEditable;
    }

    return -1;
  })();

  if (nextEditableIndex === -1) {
    inputElement.setSelectionRange(selectionStart, selectionStart);

    return;
  }

  const newValue = value.split('').map((char, index) => {
    if (index === nextEditableIndex) {
      return placeholderChar;
    }

    return char;
  }).join('');

  inputElement.value = newValue;
  onChange(newValue);

  if (direction === RemoveDirection.Left) {
    inputElement.setSelectionRange(nextEditableIndex, nextEditableIndex);
  } else {
    inputElement.setSelectionRange(nextEditableIndex + 1, nextEditableIndex + 1);
  }
};

export const replaceChars = (args: ReplaceCharsArgs) => {
  const {
    inputElement, mask, placeholderChar, formatChars, onChange, chars,
  } = args;

  const { value } = inputElement;

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const isRange = !!(selectionEnd - selectionStart);

  if (!isRange) {
    return;
  }

  let charsToInsert = chars;

  const newValue = value.split('').map((valueChar, index) => {
    const maskChar = mask[index];

    const rule = maskChar ? formatChars[maskChar] : null;

    if (!rule) {
      if (valueChar === charsToInsert[0]) {
        charsToInsert = charsToInsert.slice(1);
      }
      // not editable
      return valueChar;
    }

    if (index >= selectionStart && index <= selectionEnd) {
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

  const placeholderCharIndex = selectionStart
    + newValue.slice(selectionStart).indexOf(placeholderChar);

  const newCursorPosition = placeholderCharIndex === -1 ? newValue.length : placeholderCharIndex;
  // move cursor by number of inserted symbols
  inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
};

export const cutChars = (args: CutCharsArgs) => {
  const {
    inputElement,
  } = args;

  const { value } = inputElement;

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const isRange = !!(selectionEnd - selectionStart);

  if (!isRange) {
    return;
  }

  const cutValue = value.slice(selectionStart, selectionEnd);

  try {
    navigator.clipboard.writeText(cutValue);
  } catch (err) {
    console.warn(err);
  }

  removeChars({
    ...args,
    direction: RemoveDirection.Left,
  });
};

export const pasteChars = (args: PasteCharsArgs) => {
  const {
    inputElement, mask, placeholderChar, formatChars, onChange, chars,
  } = args;

  const { value } = inputElement;

  const selectionStart = inputElement.selectionStart ?? 0;

  let charsToInsert = chars;

  const newValue = value.split('').map((valueChar, index) => {
    const condition = index >= selectionStart && valueChar === placeholderChar;

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
