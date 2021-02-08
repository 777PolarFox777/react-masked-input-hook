import * as React from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useInputMask } from '../src';
import { carNumberMask, dateMask, phoneMask } from './constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { bootstrapExamples } from './examples/bootstrap';

export const BootstrapDemo = () => {
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
    <>
      <h2 id="phone-label">Phone example:</h2>
      <InputGroup>
        <FormControl
          {...phoneInput.getInputProps()}
          name="phone"
          data-cy="phone-input"
          placeholder="Type your phone number..."
          aria-labelledby="phone-label"
        />
      </InputGroup>
      <span className="demo-value">
        current value:
        {' '}
        {JSON.stringify(phone)}
      </span>
      <br />
      <Button size="sm" data-cy="phone-reset" type="button" onClick={() => setPhone(null)}>
        Reset field
      </Button>
      {' '}
      <Button size="sm" data-cy="phone-fill" type="button" onClick={() => setPhone('79885793452')}>
        Fill field
      </Button>
      <br />
      <code>
        <pre>
          {bootstrapExamples.phone}
        </pre>
      </code>
      <br />
      <br />
      <h2 id="date-label">Date example:</h2>
      <InputGroup>
        <FormControl
          {...dateInput.getInputProps()}
          name="date"
          data-cy="date-input"
          placeholder="Type your date..."
          aria-labelledby="date-label"
        />
      </InputGroup>
      <span className="demo-value">
        current value:
        {' '}
        {JSON.stringify(date)}
      </span>
      <br />
      <Button size="sm" data-cy="date-reset" type="button" onClick={() => setDate(null)}>
        Reset field
      </Button>
      {' '}
      <Button size="sm" data-cy="date-fill" type="button" onClick={() => setDate('07022021')}>
        Fill field
      </Button>
      <br />
      <code>
        <pre>
          {bootstrapExamples.date}
        </pre>
      </code>
      <br />
      <br />
      <h2 id="car-label">Car registration number:</h2>
      <InputGroup>
        <FormControl
          {...carInput.getInputProps()}
          name="car"
          data-cy="car-input"
          placeholder="Type your number..."
          aria-labelledby="car-label"
        />
      </InputGroup>
      <span className="demo-value">
        current value:
        {' '}
        {JSON.stringify(car)}
      </span>
      <br />
      <Button size="sm" data-cy="car-reset" type="button" onClick={() => setCar(null)}>
        Reset field
      </Button>
      {' '}
      <Button size="sm" data-cy="car-fill" type="button" onClick={() => setCar('ABC1234')}>
        Fill field
      </Button>
      <br />
      <code>
        <pre>
          {bootstrapExamples.car}
        </pre>
      </code>
    </>
  );
};

BootstrapDemo.displayName = 'BootstrapDemo';
