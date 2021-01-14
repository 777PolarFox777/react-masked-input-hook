export const valueOrEmpty = (value: string, placeholderChar: string) => {
  if (value.includes(placeholderChar)) {
    return '';
  }

  return value;
};
