import {
  InputBaseProps, InputBase, Chip, IconButton,
} from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';

const useSearchInputStyle = makeStyles((theme: Theme) => createStyles({
  inputBase: {
    maxWidth: 240,
    padding: theme.spacing(0, 1.25),
    border: `3px solid ${theme.palette.primary.main}`,
    display: 'inline-block',
    borderRadius: theme.spacing(1),
  },
}));

export interface SearchInputProps extends InputBaseProps{
  doSearch: () => void,
  searchText: string,
  clearSearchText: () => void,
}
export default function SearchInput(props: SearchInputProps): JSX.Element {
  const {
    inputRef, doSearch, searchText, clearSearchText, className, ...rest
  } = props;
  const classes = useSearchInputStyle();
  return (
    <div
      className={className || classes.inputBase}
    >
      <InputBase
        className="inputBase"
        inputRef={inputRef}
        inputProps={{
          placeholder: '활동명',
        }}
        {...rest}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            doSearch();
          }
        }}
        startAdornment={searchText && (
        <Chip
          label={searchText}
          onDelete={clearSearchText}
          color="primary"
          variant="outlined"
        />
        )}
        endAdornment={(
          <IconButton onClick={doSearch}>
            <SearchIcon className="searchIcon" color="primary" />
          </IconButton>
        )}
      />
    </div>
  );
}
