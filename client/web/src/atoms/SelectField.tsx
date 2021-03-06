import React from 'react';
import { Select, MenuItem, SelectProps } from '@material-ui/core';

export interface SelectFieldProps extends SelectProps{
  value: any,
  select: any[],
  handleCallback: React.Dispatch<React.SetStateAction<any>>
}
function SelectField({
  value, handleCallback, select, ...rest
}: SelectFieldProps): JSX.Element {
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (handleCallback) {
      handleCallback(event.target.value as any);
    }
  };

  return (
    <Select
      variant="outlined"
      value={value}
      onChange={handleSelectChange}
      {...rest}
    >
      {select.map((val) => (
        <MenuItem key={val} value={val}>{val}</MenuItem>
      ))}
    </Select>
  );
}

export default SelectField;
