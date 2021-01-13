import React, { FocusEvent, ClipboardEvent } from 'react';
import diff from 'fast-diff';
import {
  applyMask, FormatChars, inputChar, removeChars, replaceChars,
} from './utils/mask';
import { defaultFormatChars } from './utils/constants';

export interface InputMaskProps {
  mask: string,
  value: string | null,
  placeholderChar?: string,
  formatChars?: FormatChars,
  onChange: (value: string) => void,
}

export const useInputMask = (props: InputMaskProps) => {
  const {
    mask, placeholderChar = '_', formatChars = defaultFormatChars, onChange,
  } = props;

  const emptyValue = applyMask({
    value: null, mask, placeholderChar, formatChars,
  });

  const value = props.value ?? emptyValue;

  const handleFocus = React.useCallback((ev: FocusEvent<HTMLInputElement>) => {
    const maskedValue = applyMask({
      value, mask, placeholderChar, formatChars,
    });

    const start = maskedValue.indexOf(placeholderChar);

    if (start === -1) {
      // no placeholder chars in value
      return;
    }

    (ev.target as HTMLInputElement).setSelectionRange(start, start);

    setTimeout(() => {
      (ev.target as HTMLInputElement).setSelectionRange(start, start);
    });
  }, [value]);

  const handleKeyDown = React.useCallback((ev) => {
    if (ev.key === 'Backspace') {
      ev.preventDefault();
      const selectionStart = ev.target.selectionStart ?? 0;
      const selectionEnd = ev.target.selectionEnd ?? 0;
      const isRange = !!(selectionEnd - selectionStart);

      const newValue = isRange
        ? value.slice(0, selectionStart) + value.slice(selectionEnd)
        : value.slice(0, selectionStart - 1) + value.slice(selectionStart);

      const valueDiff = diff(value, newValue);

      removeChars({
        inputElement: ev.target as HTMLInputElement,
        valueDiff,
        mask,
        placeholderChar,
        formatChars,
        onChange,
      });
    }

    if (ev.key === 'Delete') {
      ev.preventDefault();
    }

    if (ev.ctrlKey) {
      return;
    }

    if (ev.key.length === 1) {
      ev.preventDefault();
      inputChar({
        inputElement: ev.target as HTMLInputElement,
        char: ev.key,
        mask,
        placeholderChar,
        formatChars,
        onChange,
      });
    }
  }, [onChange, value, mask, placeholderChar, formatChars]);

  const handlePaste = React.useCallback((ev: ClipboardEvent<HTMLInputElement>) => {
    ev.preventDefault();
    const data = ev.clipboardData.getData('text');

    replaceChars({
      inputElement: ev.target as HTMLInputElement,
      chars: data,
      mask,
      placeholderChar,
      formatChars,
      onChange,
    });
  }, []);

  const getInputProps = React.useCallback(() => ({
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    value,
  }), [handleFocus, value]);

  return {
    getInputProps,
  };
};
