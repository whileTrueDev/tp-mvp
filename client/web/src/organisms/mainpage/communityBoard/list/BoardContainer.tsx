import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import { Pagination, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import useAxios from 'axios-hooks';
import { EditingPointListResType } from '@truepoint/shared/dist/res/EditingPointListResType.interface';
import { PostFound, FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { FilterType } from '../../../../utils/hooks/useBoardListState';
import PostList from './PostList';
import SearchForm from './SearchForm';

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
  writeButtonContainer: {
    textAlign: 'right',
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
  platform: 'afreeca' | 'twitch' | 'free',
  take: number,
  // selectComponent?: JSX.Element,
  pagenationHandler: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  postFilterHandler: (categoryFilter: FilterType) => void;
  boardState: {
    posts: PostFound[];
    list: EditingPointListResType[];
    page: number;
    totalRows: number;
    filter: FilterType;
  },
  handlePostsLoad: ({ posts, total }: FindPostResType) => void;
  currentPostId? : number,
  titleComponent? : JSX.Element
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
  const {
    posts, page, totalRows, filter,
  } = boardState;
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
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
        console.error(e.response, e);
      });
    } else {
      getPostList().then((res) => {
        handlePostsLoad(res.data);
      }).catch((e) => {
        console.error(e.response, e);
      });
    }
  // 아래 변수가 바뀌는 경우에만 실행되는 이펙트
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, take, hasSearchText]);

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

      {titleComponent}

      <div className={classes.controls}>
        <ToggleButtonGroup
          value={filter}
          onChange={onFilterChange}
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
          <SearchForm
            onSearch={onSearch}
            selectOptions={['제목', '작성자']}
          />
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
        page={page}
        posts={posts}
        currentPostId={currentPostId}
        loading={loading || searchLoading}
      />

      <Pagination
        className={classes.pagination}
        shape="rounded"
        page={page}
        count={paginationCount}
        onChange={pagenationHandler}
      />
      <div className={classes.writeButtonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={moveToWritePage}
          startIcon={<CreateIcon />}
        >
          글쓰기
        </Button>
      </div>

    </div>
  );
}
