import React, { useRef, useState } from 'react';
import { IconButton, InputBase, Paper } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import SelectField from '../../../../atoms/SelectField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  inputContainer: {
    height: '32px',
    marginLeft: theme.spacing(1),
  },
  input: {
    paddingLeft: theme.spacing(1),
  },
  iconButton: {
    padding: theme.spacing(0, 1),
  },
}));

interface SearchFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>{
  onSearch: (field: any, text: string) => void;
  selectOptions: any[],
  className?: string
}
export default function SearchForm({ onSearch, selectOptions, className }: SearchFormProps): JSX.Element {
  const inputRef = useRef<HTMLSelectElement>();
  const select = useRef(selectOptions);
  const [value, setValue] = useState(select.current[0]);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (inputRef.current && onSearch) {
      const selectField = value;
      const text = inputRef.current.value.trim();
      if (!text) {
        ShowSnack('검색할 내용을 입력해주세요', 'error', enqueueSnackbar);
        return;
      }
      onSearch(selectField, text);
      inputRef.current.value = '';
    }
  };
  return (
    <div className={className}>
      <div className={classes.root}>
        <SelectField value={value} select={select.current} handleCallback={setValue} />

        <Paper className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            inputRef={inputRef}
            placeholder="검색어를 입력해주세요"
          />
          <IconButton
            color="primary"
            className={classes.iconButton}
            aria-label="search"
            onClick={onClick}
          >
            <SearchIcon />
          </IconButton>

        </Paper>
      </div>
    </div>
  );
}
