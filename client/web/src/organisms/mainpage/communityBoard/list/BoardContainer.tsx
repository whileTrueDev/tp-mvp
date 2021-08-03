import React, {
  useCallback, useMemo, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { ToggleButtonGroup } from '@material-ui/lab';
import { Button, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import PostList from './PostList';
import SearchForm from './SearchForm';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { StyledToggleButton, useBoardContainerStyles, useToggleButtonGroupsStyle } from '../style/CommunityBoardList.style';
import CustomPagination from '../../../../atoms/CustomPagination';
import useCommunityPosts from '../../../../utils/hooks/query/useCommunityPosts';
import { useCommunityBoardState, FilterType } from '../../../../store/useCommunityBoardState';

const filterButtonValues: Array<{key: FilterType, text: string, class: string}> = [
  { key: 'all', text: '전체글', class: 'all' },
  { key: 'notice', text: '공지', class: 'notice' },
  { key: 'recommended', text: '핫글', class: 'recommended' },
];

interface BoardProps{
  platform: 'afreeca' | 'twitch' | 'free',
  take: number,
  currentPostId?: number,
  titleComponent?: JSX.Element,
  initialPage?: number
}

export default function BoardContainer({
  platform,
  take,
  currentPostId,
  titleComponent,
  initialPage = 1,
}: BoardProps): JSX.Element {
  const history = useHistory();
  const classes = useBoardContainerStyles();
  const { isMobile } = useMediaSize();
  const toggleButtonGroupClasses = useToggleButtonGroupsStyle();
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
  const [page, setPage] = useState<number>(initialPage || 1);

  const { currentPlatform, filter: filters, changeFilter } = useCommunityBoardState();

  const { data, isFetching: loading, error } = useCommunityPosts({
    params: {
      platform,
      category: filters[currentPlatform],
      page,
      take,
      qtext: searchText,
      qtype: searchType,
    },
    options: {
      enabled: currentPlatform === platform,
      keepPreviousData: true,
    },
  });

  const postFilterHandler = useCallback((categoryFilter: FilterType) => {
    setPage(1);
    changeFilter(currentPlatform, categoryFilter);
  }, [changeFilter, currentPlatform]);

  const pagenationHandler = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (page === newPage) return;
    setPage(newPage);
  };

  const paginationCount = useMemo(() => {
    if (!data) return 1;
    return Math.ceil(data.total / take);
  }, [data, take]);

  const moveToWritePage = (event: React.MouseEvent<HTMLElement>) => {
    history.push({
      pathname: `/community-board/${platform}/write`,
      state: { platform },
    });
  };

  const onFilterChange = (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => {
    if (categoryFilter !== null) {
      postFilterHandler(categoryFilter);
    }
    setSearchText('');
    setSearchType('');
  };

  const onSearch = (field: any, text: string) => {
    if (field === '제목') {
      setSearchType('title');
    } else if (field === '작성자') {
      setSearchType('nickname');
    }
    setSearchText(text);
  };

  return (
    <div className={classes.root}>

      {!isMobile && titleComponent}

      <div className={classes.controls}>
        <ToggleButtonGroup
          value={filters[currentPlatform]}
          onChange={onFilterChange}
          classes={toggleButtonGroupClasses}
          exclusive
        >
          {filterButtonValues.map((btn) => (
            <StyledToggleButton
              value={btn.key}
              key={btn.key}
              className={btn.class}
            >
              {btn.text}
            </StyledToggleButton>
          ))}
        </ToggleButtonGroup>

        <div className="right">

          <Button
            variant="contained"
            color="primary"
            onClick={moveToWritePage}
            className={classes.writeButton}
          >
            <SendIcon />
            <Typography className="writeButtonText">글쓰기</Typography>
          </Button>
        </div>
      </div>

      <PostList
        take={take}
        page={page}
        posts={data ? data.posts : []}
        currentPostId={currentPostId}
        loading={loading}
        error={error}
      />
      <CustomPagination
        className={classes.pagination}
        showFirstButton
        showLastButton
        defaultPage={1}
        page={page}
        count={paginationCount}
        onChange={pagenationHandler}
        size={isMobile ? 'small' : 'medium'}
      />
      <SearchForm
        className={classes.searchForm}
        style={{ justifyContent: 'center' }}
        onSearch={onSearch}
        selectOptions={['제목', '작성자']}
      />

    </div>
  );
}
