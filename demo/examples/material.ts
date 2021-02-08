const phone = `
export const MaterialDemo = () => {
  const [phone, setPhone] = React.useState<string | null>(null);

  const phoneInput = useInputMask({
    mask: phoneMask, value: phone, onChange: setPhone,
  });

  return (
    <>
      <h2 id="phone-label">Phone example:</h2>
      <div>
        <TextField
          {...phoneInput.getInputProps()}
          name="phone"
          placeholder="Type your phone number..."
          aria-labelledby="phone-label"
        />
      </div>
      <span className="demo-value">
        current value:
        {' '}
        {JSON.stringify(phone)}
      </span>
      <br />
      <Button color="primary" variant="contained" type="button" onClick={() => setPhone(null)}>
        Reset field
      </Button>
      {' '}
      <Button color="primary" variant="contained" type="button" onClick={() => setPhone('79885793452')}>
        Fill field
      </Button>
    </>
  );
};
`;

const date = `
export const MaterialDemo = () => {
  const [date, setDate] = React.useState<string | null>('14/01/2021');

  const dateInput = useInputMask({
    mask: dateMask, value: date, onChange: setDate,
  });

  return (
    <>
      <h2 id="date-label">Date example:</h2>
      <div>
        <TextField
          {...dateInput.getInputProps()}
          name="date"
          placeholder="Type your date..."
          aria-labelledby="date-label"
        />
      </div>
      <span className="demo-value">
        current value:
        {' '}
        {JSON.stringify(date)}
      </span>
      <br />
      <Button color="primary" variant="contained" type="button" onClick={() => setDate(null)}>
        Reset field
      </Button>
      {' '}
      <Button color="primary" variant="contained" type="button" onClick={() => setDate('07022021')}>
        Fill field
      </Button>
    </>
  );
};
`;

const car = `
export const MaterialDemo = () => {
  const [car, setCar] = React.useState<string | null>(null);

  const carInput = useInputMask({
    mask: carNumberMask, value: car, onChange: setCar,
  });

  return (
    <>
      <h2 id="car-label">Car registration number:</h2>
      <div>
        <TextField
          {...carInput.getInputProps()}
          name="car"
          placeholder="Type your number..."
          aria-labelledby="car-label"
        />
      </div>
      <span className="demo-value">
        current value:
        {' '}
        {JSON.stringify(car)}
      </span>
      <br />
      <Button color="primary" variant="contained" type="button" onClick={() => setCar(null)}>
        Reset field
      </Button>
      {' '}
      <Button color="primary" variant="contained" type="button" onClick={() => setCar('ABC1234')}>
        Fill field
      </Button>
    </>
  );
};
`;

export const materialExamples = {
  phone,
  date,
  car,
};
