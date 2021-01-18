# react-masked-input-hook
A React hook for building a MaskedInput component

# Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Properties](#properties)

# Installation

> npm i react-masked-input-hook

# Usage

```jsx
import React from "react"
import { useInputMask } from "react-masked-input-hook";

const phoneMask = '+7 (###) ###-##-##';

export const PhoneInput = () => {
  const [phone, setPhone] = React.useState<string | null>(null);
  
  const phoneInput = useInputMask({
    mask: phoneMask, value: phone, onChange: setPhone,
  });

  return (
    <input {...phoneInput.getInputProps()} name="phone" placeholder="Type your phone number..." />
  );
}
```

# Properties

| Name                                                      | Type                                            | Default                                      | Description                                                                                                    |
| :-------------------------------------------------------: | :---------------------------------------------: | :------------------------------------------: | :------------------------------------------------------------------------------------------------------------: |
| **[`mask (required)`](#mask)**                            | `string`                                        |                                              | The string that represents a mask format                                                                       |
| **[`value (required)`](#value)**                          | `string \| null`                                |                                              | The value of the input                                                                                         |
| **placeholderChar**                                       | `string \| undefined`                           | `_`                                          | A character that represents unfilled parts of the mask                                                         |
| **formatChars**                                           | `{ [x: string]: string } \| undefined`          | [defaultFormatChars](src/utils/constants.ts) | An object of rules where key represents a character from mask and value is a RegExp for testing that character |
| **onChange**                                              | `(value: string) => void`                       |                                              | Change event handler                                                                                           |
| **onFocus**                                               | `React.FocusEventHandler<HTMLInputElement>`     |                                              | Focus event handler                                                                                            |
| **onBlur**                                                | `React.FocusEventHandler<HTMLInputElement>`     |                                              | Blur event handler                                                                                             |
| **onMouseDown**                                           | `React.MouseEventHandler<HTMLInputElement>`     |                                              | MouseDown event handler                                                                                        |
| **onKeyDown**                                             | `React.KeyboardEventHandler<HTMLInputElement>`  |                                              | KeyDown event handler                                                                                          |
| **onPaste**                                               | `React.ClipboardEventHandler<HTMLInputElement>` |                                              | Paste event handler                                                                                            |

## mask

The string that represents a mask format. All characters from [formatChars](#formatChars) will be tested by RegExp.

E.g. for phone number (# - represents a number in [defaultFormatChars](src/utils/constants.ts)):
```js
useInputMask({ mask: '+7 (###) ###-##-##' })
```

## value

The value of the input. In case if value doesn't match mask it will be formatted and controlled value will be updated after next change event.
When the value is incomplete the controlled value set to an empty string for allowing proper input validation.
To clean the input set value to `null`.
If in some cases instead of using the controlled value you will need a real value that user sees at that moment, use `rawValue`.

```js
const { rawValue, getInputProps } = useInputMask(...);
```
