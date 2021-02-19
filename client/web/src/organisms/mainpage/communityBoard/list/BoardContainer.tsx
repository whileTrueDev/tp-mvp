import { Pagination, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useEffect, useMemo } from 'react';
import useAxios from 'axios-hooks';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import { PostFound, FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';

import PostList from './PostList';
import BoardTitle from '../share/BoardTitle';
import { FilterType } from '../../../../utils/hooks/useBoardListState';

const filterButtonValues: Array<{key: FilterType, text: string, color: string}> = [
  { key: 'all', text: '전체글', color: 'primary' },
  { key: 'notice', text: '공지글', color: 'default' },
  { key: 'recommended', text: '추천글', color: 'secondary' },
];

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
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    '&>.right': {
      display: 'flex',
      alignItems: 'center',
      '&>*': {
        marginLeft: theme.spacing(1),
      },
    },
  },
  writeButton: {
    padding: theme.spacing(2, 0),
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
  take: number,
  selectComponent?: JSX.Element,
  pagenationHandler: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  searchText: string;
  searchType: string;
  postFilterHandler: (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => void;
  handlePostsLoad: ({ posts, total }: FindPostResType) => void;
  boardState: {
    posts: PostFound[];
    page: number;
    totalRows: number;
    filter: FilterType;
},
}

export default function BoardContainer({
  platform,
  take,
  selectComponent,
  searchText,
  searchType,
  pagenationHandler,
  postFilterHandler,
  handlePostsLoad,
  boardState,
}: BoardProps): JSX.Element {
  const history = useHistory();
  const classes = useStyles();
  const {
    posts, page, totalRows, filter,
  } = boardState;
  const url = useMemo(() => `/community/posts?platform=${platform}&category=${filter}&page=${page}&take=${take}`, [filter, platform, page, take]);
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
  }, [filter, platform, page, take, hasSearchText]);

  const moveToWritePage = (event: React.MouseEvent<HTMLElement>) => {
    history.push({
      pathname: '/community-board/write',
      state: { platform },
    });
  };

  const TitleComponent = useMemo(() => (
    <BoardTitle platform={platform} />
  ), []);

  return (
    <div className={classes.root}>

      {TitleComponent}

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
          <Button
            variant="contained"
            color="primary"
            onClick={moveToWritePage}
            className={classes.writeButton}
          >
            <CreateIcon />
          </Button>
        </div>
      </div>

      <PostList
        take={take}
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
