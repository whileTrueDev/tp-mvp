import React, { useRef, useState } from 'react';
import {
  IconButton, InputAdornment, OutlinedInput, Paper,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
// import SelectField from '../../../../atoms/SelectField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  inputContainer: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: `3px solid ${theme.palette.text.primary}`,
    },
    display: 'flex',
    boxShadow: 'none',
    marginLeft: theme.spacing(1),
  },
  input: {
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.background.paper,
  },
  iconButton: {
    padding: theme.spacing(0, 1),
    color: theme.palette.text.primary,
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
  const [value] = useState(select.current[0]);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const doSearch = () => {
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
  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    doSearch();
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key === 'Enter') {
      doSearch();
    }
  };
  return (
    <div className={className}>
      <div className={classes.root}>
        {/* <SelectField value={value} select={select.current} handleCallback={setValue} /> */}

        <Paper className={classes.inputContainer}>
          <OutlinedInput
            className={classes.input}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
            placeholder="글찾기~"
            startAdornment={
              (
                <InputAdornment position="start">
                  <IconButton
                    className={classes.iconButton}
                    aria-label="search"
                    onClick={onClick}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </Paper>
      </div>
    </div>
  );
}
