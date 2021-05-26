import React, { useRef, useState } from 'react';
import {
  IconButton, InputAdornment, OutlinedInput, Paper,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
// import SelectField from '../../../../atoms/SelectField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import SelectField from '../../../../atoms/SelectField';
import useMediaSize from '../../../../utils/hooks/useMediaSize';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'inline-flex',
  },
  inputContainer: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: `3px solid ${theme.palette.primary.main}`,
    },
    display: 'flex',
    boxShadow: 'none',
    marginLeft: theme.spacing(1),
  },
  input: {
    width: theme.spacing(50),
    padding: 0,
    backgroundColor: theme.palette.primary.main,
    '& input': {
      backgroundColor: theme.palette.background.paper,
    },
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(35),
      '& input': {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        fontSize: theme.spacing(1.5),
      },
    },
  },
  iconButton: {
    color: theme.palette.primary.contrastText,
    '& .MuiSvgIcon-root': {
      fontSize: theme.spacing(4),
    },
  },
  select: {
    '& .MuiSelect-root': {
      minWidth: theme.spacing(5),
    },
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
  const { isMobile } = useMediaSize();

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
        {!isMobile && (
          <SelectField
            className={classes.select}
            value={value}
            select={select.current}
            handleCallback={setValue}
          />
        )}

        <Paper className={classes.inputContainer}>
          <OutlinedInput
            className={classes.input}
            onKeyDown={onKeyDown}
            inputRef={inputRef}
            placeholder="검색할 내용을 입력해주세요"
            endAdornment={
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
