import * as React from 'react';
import { useInputMask } from '../src';

const phoneMask = '+7 (###) ###-##-##';
const dateMask = '##/##/####';
const carNumberMask = 'AAA-####';

export const App = () => {
  const [phone, setPhone] = React.useState<string | null>(null);

  const phoneInput = useInputMask({
    mask: phoneMask, value: phone, onChange: setPhone,
  });

  const [date, setDate] = React.useState<string | null>('14/01/2021');

  const dateInput = useInputMask({
    mask: dateMask, value: date, onChange: setDate,
  });

  const [car, setCar] = React.useState<string | null>(null);

  const carInput = useInputMask({
    mask: carNumberMask, value: car, onChange: setCar,
  });

  return (
    <div>
      <h1>React MaskedInput hook</h1>
      <br />
      <h2>Phone example:</h2>
      <br />
      current value:
      {' '}
      {JSON.stringify(phone)}
      <br />
      <br />
      <input name="phone" {...phoneInput.getInputProps()} placeholder="Type your phone number..." />
      <br />
      <br />
      <button type="button" onClick={() => setPhone(null)}>
        Reset field
      </button>
      <br />
      <br />
      <h2>Date example:</h2>
      <br />
      current value:
      {' '}
      {JSON.stringify(date)}
      <br />
      <br />
      <input name="date" {...dateInput.getInputProps()} placeholder="Type your date..." />
      <br />
      <br />
      <button type="button" onClick={() => setDate(null)}>
        Reset field
      </button>
      <br />
      <br />
      <h2>Car registration number:</h2>
      <br />
      current value:
      {' '}
      {JSON.stringify(car)}
      <br />
      <br />
      <input name="car" {...carInput.getInputProps()} placeholder="Type your number..." />
      <br />
      <br />
      <button type="button" onClick={() => setCar(null)}>
        Reset field
      </button>
    </div>
  );
};

App.displayName = 'App';
