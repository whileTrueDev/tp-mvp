import React, { useMemo } from 'react';
import HighlightlistTable from './HighlightListTable';
import BoardTitle from '../../communityBoard/share/BoardTitle';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useHighlightPaginationState } from '../../../../utils/hooks/useHighlightPaginationState';
import { useHighlightListStyle, StyleProps } from '../style/useHighLightListStyle';
import SearchInput from '../../shared/SearchInput';

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
    data: queryData, isFetching: loading,
    doSearch, searchText, clearSearchText,
    handlePageChange, take, inputRef,
  } = useHighlightPaginationState({ itemPerPage: isMobile ? 10 : 30, platform });

  const titleComponent = useMemo(() => (
    <BoardTitle boardType platform={platform} />
  ), [platform]);

  const searchInput = useMemo(() => (
    <SearchInput
      fullWidth
      inputRef={inputRef}
      doSearch={doSearch}
      searchText={searchText}
      clearSearchText={clearSearchText}
      className={classes.searchInputContainer}
    />
  ), [classes.searchInputContainer, clearSearchText, doSearch, inputRef, searchText]);

  const customHeader = () => (
    <thead className={classes.customTHeader}>
      <tr className="tr">
        <th className="th" colSpan={3}>
          활동명
          {queryData && <span className="totalCount">{`(${queryData.totalCount})`}</span>}
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
        data={queryData}
        loading={loading}
        handlePageChange={handlePageChange}
        header={customHeader}
        take={take}
      />
    </div>
  );
}
