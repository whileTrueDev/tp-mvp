import {
  Select, MenuItem, FormControl, InputLabel,
} from '@material-ui/core';
import React from 'react';

interface Props{
  id: string,
  columns: any[],
  index: number,
  changeHandler: (index: number) => void
}

function getInputLabel(key: string): string {
  switch (key) {
    case 'main':
      return '방송인 검색';
    case 'category':
      return '카테고리';
    case 'platform':
      return '플랫폼';
    default:
      return '';
  }
}
export default function RankingDropDown(props: Props): JSX.Element {
  const {
    columns, index, changeHandler, id,
  } = props;

  return (
    <FormControl style={{ flex: 1, maxWidth: id === 'main' ? '40%' : '30%' }}>
      <InputLabel shrink id={id}>
        {getInputLabel(id)}
      </InputLabel>
      <Select
        labelId={id}
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
    </FormControl>

  );
}
