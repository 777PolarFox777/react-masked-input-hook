const phone = `
export const BootstrapDemo = () => {
  const [phone, setPhone] = React.useState<string | null>(null);

  const phoneInput = useInputMask({
    mask: phoneMask, value: phone, onChange: setPhone,
  });

  return (
    <>
      <h2 id="phone-label">Phone example:</h2>
      <InputGroup className="w-50">
        <FormControl
          {...phoneInput.getInputProps()}
          name="phone"
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
      <Button size="sm" type="button" onClick={() => setPhone(null)}>
        Reset field
      </Button>
      {' '}
      <Button size="sm" type="button" onClick={() => setPhone('79885793452')}>
        Fill field
      </Button>
    </>
  );
};
`;

const date = `
export const BootstrapDemo = () => {
  const [date, setDate] = React.useState<string | null>('14/01/2021');

  const dateInput = useInputMask({
    mask: dateMask, value: date, onChange: setDate,
  });

  return (
    <>
      <h2 id="date-label">Date example:</h2>
      <InputGroup className="w-50">
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
    </>
  );
};
`;

const car = `
export const BootstrapDemo = () => {
  const [car, setCar] = React.useState<string | null>(null);

  const carInput = useInputMask({
    mask: carNumberMask, value: car, onChange: setCar,
  });

  return (
    <>
      <h2 id="car-label">Car registration number:</h2>
      <InputGroup className="w-50">
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
    </>
  );
};
`;

export const bootstrapExamples = {
  phone,
  date,
  car,
};
