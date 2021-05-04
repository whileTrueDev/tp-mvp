import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles, createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import {
  Pagination, PaginationItem, ToggleButton, ToggleButtonGroup,
} from '@material-ui/lab';
import { Button, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import useAxios from 'axios-hooks';
import { EditingPointListResType } from '@truepoint/shared/dist/res/EditingPointListResType.interface';
import { PostFound, FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { FilterType } from '../../../../utils/hooks/useBoardListState';
import PostList from './PostList';
import SearchForm from './SearchForm';

const filterButtonValues: Array<{key: FilterType, text: string, class: string}> = [
  { key: 'all', text: '전체글', class: 'all' },
  { key: 'notice', text: '공지', class: 'notice' },
  { key: 'recommended', text: '핫글', class: 'recommended' },
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
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? '100' : 'A400'],
    marginBottom: theme.spacing(2),
    '& .MuiPagination-ul>*:first-child>.MuiPaginationItem-root': {
      border: '1px solid currentColor',
    },
    '& .MuiPagination-ul>*:last-child>.MuiPaginationItem-root': {
      border: '1px solid currentColor',
    },
  },
  paginationItem: {
    '&.MuiPaginationItem-root': {
      color: theme.palette.text.secondary,
      border: 'none',
      fontSize: theme.typography.body1.fontSize,
    },
    '&.Mui-selected': {
      color: theme.palette.text.primary,
    },
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    '&>.right': {
      display: 'flex',
      alignItems: 'center',
      '&>*': {
        marginLeft: theme.spacing(1),
      },
    },
  },
  writeButton: {
    padding: theme.spacing(2),
  },
  writeButtonContainer: {
    textAlign: 'right',
  },
}));

const StyledToggleButton = withStyles((theme: Theme) => createStyles({
  root: {
    height: theme.spacing(7),
    minWidth: theme.spacing(18),
    [theme.breakpoints.down('sm')]: {
      minWidth: theme.spacing(9),
    },
    fontSize: theme.typography.h5.fontSize,
    marginRight: theme.spacing(2),
    '&.Mui-selected': {
      position: 'relative',
      '&:before': {
        display: 'block',
        position: 'absolute',
        content: '" "',
        borderLeft: `${theme.spacing(1)}px solid red`,
        borderTop: `${theme.spacing(1)}px solid transparent`,
        borderBottom: `${theme.spacing(1)}px solid transparent`,
        left: theme.spacing(2),
        top: '50%',
        transform: 'translateY(-50%)',
      },
      border: 'none',
    },
    '&.all': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
    },
    '&.notice': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.action.disabled,
    },
    '&.recommended': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(ToggleButton);

const useToggleButtonGroupsStyle = makeStyles((theme: Theme) => createStyles({
  root: {},
  groupedHorizontal: {
    '&:not(:last-child), &:not(:first-child), &': {
      borderRadius: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}));

interface BoardProps{
  platform: 'afreeca' | 'twitch' | 'free',
  take: number,
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

      {titleComponent}

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
          <SearchForm
            style={{ justifyContent: 'center' }}
            onSearch={onSearch}
            selectOptions={['제목', '작성자']}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={moveToWritePage}
            className={classes.writeButton}
          >
            <SendIcon />
            <Typography>글쓰기</Typography>
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

      <Pagination
        className={classes.pagination}
        variant="outlined"
        page={page}
        count={paginationCount}
        onChange={pagenationHandler}
        renderItem={(item) => (
          <PaginationItem
            className={classes.paginationItem}
            {...item}
          />
        )}
      />
      <div className={classes.writeButtonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={moveToWritePage}
          startIcon={<SendIcon />}
        >
          글쓰기
        </Button>
      </div>
    </div>
  );
}
