import { Pagination, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import useAxios from 'axios-hooks';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import useBoardState, { FilterType } from '../useBoardListState';
import PostList from './PostList';
import SearchForm from './SearchForm';
import BoardTitle from './BoardTitle';

const boardColumns = [
  { key: 'postNumber', title: '번호', width: '5%' },
  { key: 'title', title: '제목', width: '50%' },
  { key: 'writer', title: '작성자', width: '20%' },
  { key: 'date', title: '작성일', width: '15%' },
  { key: 'hit', title: '조회', width: '5%' },
  { key: 'recommend', title: '추천', width: '5%' },
];

const filterButtonValues: Array<{key: FilterType, text: string, color: string}> = [
  { key: 'all', text: '전체글', color: 'primary' },
  { key: 'notice', text: '공지글', color: 'default' },
  { key: 'recommended', text: '추천글', color: 'secondary' },
];

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '100%',
  },
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    '&>.right': {
      display: 'flex',
      alignItems: 'center',
      '&>*': {
        marginLeft: theme.spacing(1),
      },
    },
  },
}));

const StyledToggleButton = withStyles((theme: Theme) => createStyles({
  root: {
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(ToggleButton);

interface BoardProps{
  platform: 'afreeca' | 'twitch',
  take?: number,
  selectComponent?: JSX.Element,
}
export default function BoardContainer({
  platform,
  take = 10,
  selectComponent,
}: BoardProps): JSX.Element {
  const {
    posts, setPosts, page, setPage,
    totalRows, setTotalRows,
    // currentPostId, setCurrentPostId,
    filter, setFilter, pagenationHandler,
  } = useBoardState();
  const history = useHistory();
  const classes = useStyles();
  const url = useMemo(() => `/community/posts?platform=${platform}&category=${filter}&page=${page}&take=${take}`, [filter, platform, page, take]);
  const [searchType, setSearchType] = useState<string>('');
  const [searchText, setSeatchText] = useState<string>('');
  const searchUrl = useMemo(() => `${url}&qtext=${searchText}&qtype=${searchType}`, [url, searchText, searchType]);
  const paginationCount = useMemo(() => Math.ceil(totalRows / take), [totalRows, take]);

  // TODO : post 값이 postEntity라서 필요없는 content도 같이 들어옴... 리턴값 변경하고 useAxios타입정의하기
  const [{ loading }, getPostList] = useAxios({ url }, { manual: true });
  const [{ loading: searchLoading }, getSearchList] = useAxios({ url: searchUrl }, { manual: true });

  const handleLoadedPosts = useCallback(({ posts: loadedPosts, total }: {posts: any[], total: number}) => {
    setTotalRows(total);
    setPosts(loadedPosts);

    // console.log('handleLodedPost', { total, loadedPosts });
  }, [setPosts, setTotalRows]);

  const hasSearchText = useMemo(() => searchType && searchType !== '' && searchText && searchText !== '', [searchText, searchType]);

  useEffect(() => {
    if (hasSearchText) {
      // 검색하는경우
      getSearchList().then((res) => {
        handleLoadedPosts(res.data);
      }).catch((e) => {
        console.error(e);
      });
    } else {
      getPostList().then((res) => {
        handleLoadedPosts(res.data);
      }).catch((e) => {
        console.error(e);
      });
    }
  // 아래 변수가 바뀌는 경우에만 실행되는 이펙트
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, platform, page, take, hasSearchText]);

  const postFilterHandler = (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => {
    if (categoryFilter !== null) {
      setPage(1);
      setSearchType('');
      setSeatchText('');
      setFilter(categoryFilter);
    }
  };

  const moveToWritePage = (event: React.MouseEvent<HTMLElement>) => {
    history.push({
      pathname: '/community-board/write',
      state: { platform },
    });
  };

  const onSearch = (field: any, text: string) => {
    let searchColumn = '';
    if (field === '제목') {
      searchColumn = 'title';
    } else if (field === '작성자') {
      searchColumn = 'nickname';
    }
    setPage(1);
    setFilter('all');
    setSearchType(searchColumn);
    setSeatchText(text);
  };

  return (
    <div className={classes.root}>

      <BoardTitle platform={platform} />

      <div className={classes.controls}>
        <ToggleButtonGroup
          value={filter}
          onChange={postFilterHandler}
          exclusive
        >
          {filterButtonValues.map((btn) => (
            <StyledToggleButton
              value={btn.key}
              key={btn.key}
            >
              {btn.text}

            </StyledToggleButton>
          ))}
        </ToggleButtonGroup>

        <div className="right">
          {selectComponent}
          <Button variant="contained" color="primary" onClick={moveToWritePage}><CreateIcon /></Button>
        </div>
      </div>

      <div>
        {searchText && (
          <div>
            <span>{`검색한 내용 : ${searchText}`}</span>
            <button onClick={() => {
              setSearchType('all'); setSeatchText('');
            }}
            >
              x
            </button>
          </div>
        )}
      </div>
      <PostList
        boardColumns={boardColumns}
        posts={posts}
        loading={loading || searchLoading}
      />

      <Pagination
        className={classes.centeredContainer}
        shape="rounded"
        size="small"
        page={page}
        count={paginationCount}
        onChange={pagenationHandler}
      />

      <SearchForm
        className={classes.centeredContainer}
        onSearch={onSearch}
        selectOptions={['제목', '작성자']}
      />
    </div>
  );
}
