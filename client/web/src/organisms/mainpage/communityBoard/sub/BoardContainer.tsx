import { Pagination, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import useAxios from 'axios-hooks';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import useBoardState, { FilterType } from '../useBoardState';
import PostList from './PostList';
import SearchForm from './SearchForm';

const boardColumns = [
  { key: 'numbering', title: '번호', width: '5%' },
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
  title?: string,
  selectComponent?: any,
}
export default function BoardContainer({
  platform,
  take = 10,
  title,
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

  const [{ loading }, getPostList] = useAxios({ url }, { manual: true });
  const [{ loading: searchLoading }, getSearchList] = useAxios({ url: searchUrl }, { manual: true });

  const handleLoadedPosts = ({ posts: loadedPosts, total }: {posts: any[], total: number}) => {
    setTotalRows(total);
    setPosts(loadedPosts);
  };

  useEffect(() => {
    if (!searchType || searchType === '' || !searchText || searchText === '') {
      // console.log('일반 글 보기...');
      getPostList().then((res) => {
        handleLoadedPosts(res.data);
      }).catch((e) => {
        console.error(e);
      });
    } else {
      // 검색하는경우
      // console.log('검색');
      getSearchList().then((res) => {
        handleLoadedPosts(res.data);
      }).catch((e) => {
        console.error(e);
      });
    }
  }, [filter, platform, page, take, searchType, searchText]);

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
    // request with field and text
    // console.log('요청', { field, text });
    let searchColumn = '';
    if (field === '제목') {
      searchColumn = 'title';
    } else if (field === '내용') {
      searchColumn = 'content';
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

      <div className="title">
        {platform}
        {' '}
        {title}
      </div>

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
        total={totalRows}
        page={page}
        take={take}
        loading={loading || searchLoading}
      />

      <Pagination
        className={classes.centeredContainer}
        shape="rounded"
        size="small"
        page={page}
        count={Math.ceil(totalRows / take)}
        onChange={pagenationHandler}
      />

      <SearchForm
        className={classes.centeredContainer}
        onSearch={onSearch}
        selectOptions={['제목', '내용', '작성자']}
      />
    </div>
  );
}
