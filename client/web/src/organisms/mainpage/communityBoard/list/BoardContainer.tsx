import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToggleButtonGroup } from '@material-ui/lab';
import { Button, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import useAxios from 'axios-hooks';
import { PostFound, FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { FilterType } from '../../../../utils/hooks/useBoardListState';
import PostList from './PostList';
import SearchForm from './SearchForm';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useStyles, StyledToggleButton, useToggleButtonGroupsStyle } from '../style/CommunityBoardList.style';
import CustomPagination from '../../../../atoms/CustomPagination';

const filterButtonValues: Array<{key: FilterType, text: string, class: string}> = [
  { key: 'all', text: '전체글', class: 'all' },
  { key: 'notice', text: '공지', class: 'notice' },
  { key: 'recommended', text: '핫글', class: 'recommended' },
];

interface BoardProps{
  platform: 'afreeca' | 'twitch' | 'free',
  take: number,
  pagenationHandler: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  postFilterHandler: (categoryFilter: FilterType) => void;
  boardState: {
    posts: PostFound[];
    page: number;
    totalRows: number;
    filter: FilterType;
  },
  handlePostsLoad: (props: FindPostResType) => void;
  currentPostId?: number,
  titleComponent?: JSX.Element
}

type postGetParam = {
  platform: 'afreeca' | 'twitch' | 'free',
  category: FilterType,
  page: number,
  take: number,
  qtext?: string,
  qtype?: string,
}

export default function BoardContainer({
  platform,
  take,
  pagenationHandler,
  postFilterHandler,
  handlePostsLoad,
  boardState,
  currentPostId,
  titleComponent,
}: BoardProps): JSX.Element {
  const history = useHistory();
  const classes = useStyles();
  const { isMobile } = useMediaSize();
  const toggleButtonGroupClasses = useToggleButtonGroupsStyle();
  const {
    posts, page, totalRows, filter,
  } = boardState;
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
  const paginationCount = useMemo(() => Math.ceil(totalRows / take), [totalRows, take]);

  const [{ loading, error }, getPostList] = useAxios('/community/posts', { manual: true });

  useEffect(() => {
    const params: postGetParam = {
      platform,
      category: filter,
      page,
      take,
    };
    getPostList({
      params,
    }).then((res) => {
      handlePostsLoad(res.data);
    }).catch((e) => {
      console.error(e.response, e);
    });
  // 아래 변수가 바뀌는 경우에만 실행되는 이펙트
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, take]);

  useEffect(() => {
    if (!searchText) {
      return;
    }
    const params: postGetParam = {
      platform,
      category: filter,
      page,
      take,
      qtype: searchType,
      qtext: searchText,
    };
    getPostList({ params })
      .then((res) => {
        handlePostsLoad(res.data);
      })
      .catch((e) => console.error(e.response, e));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

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
          value={filter}
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
        posts={posts}
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
