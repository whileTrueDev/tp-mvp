import {
  Select, MenuItem, FormControl, InputLabel, InputBase,
} from '@material-ui/core';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
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

const BootstrapInput = withStyles((theme: Theme) => createStyles({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: theme.typography.caption.fontSize,
    padding: theme.spacing(1),
    '&:not(:last-child)': {
      marginRight: theme.spacing(0.5),
    },
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

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
        input={<BootstrapInput />}
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
