import { Select, MenuItem } from '@material-ui/core';
import React from 'react';

interface Props{
  columns: any[],
  index: number,
  changeHandler: (index: number) => void
}
export default function RankingDropDown(props: Props): JSX.Element {
  const { columns, index, changeHandler } = props;

  return (
    <Select
      variant="outlined"
      value={columns[index].label}
      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
        const label = event.target.value;
        const currentIndex = columns.findIndex((tab) => tab.label === label);
        changeHandler(currentIndex);
      }}
    >
      {columns.map((val) => (
        <MenuItem key={val.label} value={val.label}>{val.label}</MenuItem>
      ))}
    </Select>
  );
}
