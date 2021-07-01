import React, { useMemo } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Chip, IconButton, InputBase } from '@material-ui/core';
import HighlightlistTable from './HighlightListTable';
import BoardTitle from '../../communityBoard/share/BoardTitle';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useHighlightListContainerState } from '../../../../utils/hooks/useHighlightListContainerState';
import { useHighlightListStyle, StyleProps } from '../style/useHighLightListStyle';

interface HighlightListProps{
  platform: 'afreeca' | 'twitch',
}

export default function HighlightListContainer({
  platform,
}: HighlightListProps): JSX.Element {
  const { isMobile } = useMediaSize();
  const styleProps: StyleProps = { platform, isMobile };
  const classes = useHighlightListStyle(styleProps);
  const {
    doSearch, searchText, clearSearchText,
    data, loading, handlePageChange, take, inputRef,
  } = useHighlightListContainerState(platform);

  const titleComponent = useMemo(() => (
    <BoardTitle boardType platform={platform} />
  ), [platform]);

  const searchInput = useMemo(() => (
    <div className={classes.searchInputContainer}>
      <InputBase
        className="inputBase"
        inputRef={inputRef}
        inputProps={{
          placeholder: '활동명',
        }}
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
            <SearchIcon className="searchIcon" />
          </IconButton>
        )}
      />
    </div>
  ), [classes.searchInputContainer, clearSearchText, doSearch, inputRef, searchText]);

  const customHeader = () => (
    <thead className={classes.customTHeader}>
      <tr className="tr">
        <th className="th" colSpan={3}>
          활동명
          {data && <span className="totalCount">{`(${data.totalCount})`}</span>}
        </th>
      </tr>
    </thead>
  );

  return (
    <div className={classes.tableWrapper}>
      <div className={classes.toolbarContainer}>
        {!isMobile && titleComponent}
        {searchInput}
      </div>
      <HighlightlistTable
        data={data}
        loading={loading}
        handlePageChange={handlePageChange}
        header={customHeader}
        take={take}
      />
    </div>
  );
}
