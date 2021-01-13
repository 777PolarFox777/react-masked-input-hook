import * as React from 'react';
import { useInputMask } from '../src/index';

const mask = '+7 (###) ###-##-##';

export const App = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const { getInputProps } = useInputMask({
    mask, value, onChange: setValue,
  });

  return (
    <div>
      <input {...getInputProps()} placeholder="Demo app" />
    </div>
  );
};

App.displayName = 'App';
