import React, { useEffect, useMemo } from 'react';

import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import useAxios from 'axios-hooks';
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';
import PostList from './PostList';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '100%',
    width: '100%',
    minWidth: '650px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
}));

interface HighlightListProps{
  platform: 'afreeca' | 'twitch',
  take: number,
  selectComponent?: JSX.Element,
  pagenationHandler: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  searchText: string;
  searchType: string;
  handlePostsLoad: ({ posts, total }: FindPostResType) => void;
  boardState: {
    posts: PostFound[];
    page: number;
    totalRows: number;
  },
  titleComponent? : JSX.Element
}

export default function HighlightListContainer({
  platform,
  take,
  selectComponent,
  searchText,
  searchType,
  pagenationHandler,
  handlePostsLoad,
  boardState,
  titleComponent,
}: HighlightListProps): JSX.Element {
  const classes = useStyles();
  const {
    posts, page, totalRows,
  } = boardState;
  // const url = useMemo(() => 'asdfasdfasdf', [platform, page, take]);
  const url = useMemo(() => 'asdfasdfasdf', []);
  const searchUrl = useMemo(() => `${url}&qtext=${searchText}&qtype=${searchType}`, [url, searchText, searchType]);
  const paginationCount = useMemo(() => Math.ceil(totalRows / take), [totalRows, take]);

  const [{ loading }, getPostList] = useAxios({ url }, { manual: true });
  const [{ loading: searchLoading }, getSearchList] = useAxios({ url: searchUrl }, { manual: true });

  const hasSearchText = useMemo(() => searchType && searchType !== '' && searchText && searchText !== '', [searchText, searchType]);

  useEffect(() => {
    if (hasSearchText) {
      // 검색하는경우
      getSearchList().then((res) => {
        handlePostsLoad(res.data);
      }).catch((e) => {
        console.error(e);
      });
    } else {
      getPostList().then((res) => {
        handlePostsLoad(res.data);
      }).catch((e) => {
        console.error(e);
      });
    }
  // 아래 변수가 바뀌는 경우에만 실행되는 이펙트
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, page, take, hasSearchText]);

  return (
    <div className={classes.root}>
      {titleComponent}

      <div>
        {selectComponent}
      </div>

      <PostList
        take={take}
        page={page}
        posts={posts}
        loading={loading || searchLoading}
      />

      <Pagination
        className={classes.pagination}
        shape="rounded"
        page={page}
        count={paginationCount}
        onChange={pagenationHandler}
      />
    </div>
  );
}
