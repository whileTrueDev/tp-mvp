import React from 'react';

export default function useEventTargetValue(defaultValue = ''): {
  value: string;
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  handleReset(): void;
  setValue: (value: React.SetStateAction<string>) => void;
  handleChangePhoneNumber?(e: React.ChangeEvent<HTMLInputElement>): void;
  handleChangeISODateNumber?(e: React.ChangeEvent<HTMLInputElement>): void;
} {
  const [value, setValue] = React.useState(defaultValue);

  function inputPhoneNumber(phoneNumber: string): string {
    const number = phoneNumber.replace(/[^0-9]/g, '');
    let phone = '';
    if (number.length < 4) {
      return number;
    } if (number.length < 7) {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3);
    } else if (number.length < 11) {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3, 3);
      phone += '-';
      phone += number.substr(6);
    } else {
      phone += number.substr(0, 3);
      phone += '-';
      phone += number.substr(3, 4);
      phone += '-';
      phone += number.substr(7);
    }
    return phone;
  }

  function inputISODate(dateString: string): string {
    const number = dateString.replace(/[^0-9]/g, '');
    let date = '';
    if (number.length < 5) {
      return number;
    } if (number.length < 7) {
      date += number.substr(0, 4);
      date += '-';
      date += number.substr(4, 5);
    } else if (number.length < 9) {
      date += number.substr(0, 4);
      date += '-';
      date += number.substr(4, 2);
      date += '-';
      date += number.substr(6, 2);
    } else {
      date += number.substr(0, 4);
      date += '-';
      date += number.substr(4, 2);
      date += '-';
      date += number.substr(6);
    }
    return date;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setValue(e.target.value);
  }

  function handleChangePhoneNumber(e: React.ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setValue(inputPhoneNumber(e.target.value));
  }

  function handleChangeISODateNumber(e: React.ChangeEvent<HTMLInputElement>): void {
    // e.preventDefault();
    setValue(inputISODate(e.target.value));
  }

  function handleReset(): void {
    setValue(defaultValue);
  }

  return {
    value,
    handleChange,
    handleReset,
    setValue,
    handleChangePhoneNumber,
    handleChangeISODateNumber,
  };
}
