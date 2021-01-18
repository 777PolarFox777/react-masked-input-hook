import React, {
  ChangeEvent,
  ClipboardEvent,
  ClipboardEventHandler,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import {
  applyMask, cutChars, FormatChars, inputChar, pasteChars, removeChars,
} from './utils/mask';
import { defaultFormatChars, RemoveDirection } from './utils/constants';
import { valueOrEmpty } from './utils/helpers';

export interface InputMaskProps {
  mask: string,
  value: string | null,
  placeholderChar?: string,
  formatChars?: FormatChars,
  onChange: (value: string) => void,
  onFocus?: FocusEventHandler<HTMLInputElement>,
  onBlur?: FocusEventHandler<HTMLInputElement>,
  onMouseDown?: MouseEventHandler<HTMLInputElement>,
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>,
  onPaste?: ClipboardEventHandler<HTMLInputElement>,
}

export const useInputMask = (props: InputMaskProps) => {
  const {
    mask,
    value,
    placeholderChar = '_',
    formatChars = defaultFormatChars,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onMouseDown,
    onPaste,
  } = props;

  const emptyValue = React.useMemo(() => applyMask({
    value: null, mask, placeholderChar, formatChars,
  }), [mask, placeholderChar, formatChars]);

  const [inputValue, setInputValue] = React.useState(() => applyMask({
    value, mask, placeholderChar, formatChars,
  }));

  React.useEffect((): void => {
    if (value !== '') {
      const newValue = applyMask({
        value, mask, placeholderChar, formatChars,
      });

      setInputValue(newValue);
      onChange(valueOrEmpty(newValue, placeholderChar));
    }
  }, [formatChars, mask, onChange, placeholderChar, value]);

  const [isFocused, setIsFocused] = React.useState(false);

  const handleChange = React.useCallback((newValue: string) => {
    onChange(valueOrEmpty(newValue, placeholderChar));
    setInputValue(newValue);
  }, [onChange, placeholderChar]);

  const handleInputChange = React.useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    // changes like auto-fill or something
    handleChange(
      applyMask({
        value: ev.target.value,
        mask,
        placeholderChar,
        formatChars,
      }),
    );
  }, [formatChars, handleChange, mask, placeholderChar]);

  const handleFocus = React.useCallback((ev: FocusEvent<HTMLInputElement>) => {
    // timeout to enable Chrome's autofill
    setTimeout(() => setIsFocused(true), 1);

    const placeholderCharIndex = inputValue.indexOf(placeholderChar);

    if (placeholderCharIndex === -1) {
      // no placeholder chars in value, leave cursor where it is
      return;
    }

    const setCursorPosition = () => (ev.target as HTMLInputElement)
      .setSelectionRange(placeholderCharIndex, placeholderCharIndex);

    setCursorPosition();
    // for unknown reasons Chrome resets focus twice after render
    // timeout is needed to reset focus again
    setTimeout(setCursorPosition);

    onFocus?.(ev);
  }, [inputValue, onFocus, placeholderChar]);

  const handleBlur = React.useCallback((ev: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    onBlur?.(ev);
  }, [onBlur]);

  const handleKeyDown = React.useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.ctrlKey) {
      if (ev.code === 'KeyX') {
        cutChars({
          inputElement: ev.target as HTMLInputElement,
          mask,
          placeholderChar,
          formatChars,
          onChange: handleChange,
        });

        return;
      }

      return;
    }

    if (ev.key === 'Backspace') {
      ev.preventDefault();

      removeChars({
        inputElement: ev.target as HTMLInputElement,
        mask,
        placeholderChar,
        formatChars,
        onChange: handleChange,
        direction: RemoveDirection.Left,
      });
    }

    if (ev.key === 'Delete') {
      ev.preventDefault();

      removeChars({
        inputElement: ev.target as HTMLInputElement,
        mask,
        placeholderChar,
        formatChars,
        onChange: handleChange,
        direction: RemoveDirection.Right,
      });
    }

    if (ev.key.length === 1) {
      ev.preventDefault();
      inputChar({
        inputElement: ev.target as HTMLInputElement,
        char: ev.key,
        mask,
        placeholderChar,
        formatChars,
        onChange: handleChange,
      });
    }

    onKeyDown?.(ev);
  }, [onKeyDown, mask, placeholderChar, formatChars, handleChange]);

  const handleMouseDown = React.useCallback((ev: MouseEvent<HTMLInputElement>) => {
    if (!isFocused) {
      ev.preventDefault();

      (ev.target as HTMLInputElement).focus();
    }

    onMouseDown?.(ev);
  }, [isFocused, onMouseDown]);

  const handlePaste = React.useCallback((ev: ClipboardEvent<HTMLInputElement>) => {
    ev.preventDefault();
    const data = ev.clipboardData.getData('text');

    pasteChars({
      inputElement: ev.target as HTMLInputElement,
      chars: data,
      mask,
      placeholderChar,
      formatChars,
      onChange: handleChange,
    });

    onPaste?.(ev);
  }, [formatChars, handleChange, mask, onPaste, placeholderChar]);

  const getInputProps = React.useCallback(() => ({
    onChange: handleInputChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseDown: handleMouseDown,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    value: isFocused || inputValue !== emptyValue ? inputValue : '',
  }), [
    emptyValue,
    handleBlur,
    handleFocus,
    handleInputChange,
    handleKeyDown,
    handleMouseDown,
    handlePaste,
    inputValue,
    isFocused,
  ]);

  return {
    getInputProps,
    rawValue: inputValue,
  };
};
