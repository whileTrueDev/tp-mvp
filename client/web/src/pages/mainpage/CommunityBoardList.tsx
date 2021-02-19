import { Grid, IconButton, Typography } from '@material-ui/core';
import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import BoardContainer from '../../organisms/mainpage/communityBoard/list/BoardContainer';
import SelectField from '../../atoms/SelectField';
import SearchForm from '../../organisms/mainpage/communityBoard/list/SearchForm';
import useBoardState, { FilterType } from '../../utils/hooks/useBoardListState';

const scrollToContainerTop = (ref: React.MutableRefObject<any>) => {
  if (ref.current) {
    window.scrollTo({
      left: 0,
      top: ref.current.offsetTop - 72, // 헤더높이 72px제외
      behavior: 'smooth',
    });
  }
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  centerWrapper: {
    width: '100%',
    minWidth: '1400px', // <ProductHero/>의 minWidth에 맞춤
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  boardWrapper: {
    width: '45%',
  },
  hide: {
    visibility: 'hidden',
  },
}));

export default function CommunityBoardList(): JSX.Element {
  const classes = useStyles();

  const select = useRef<number[]>([5, 10]); // 한 페이지당 보여질 글 개수 select 옵션
  const [take, setTake] = useState<number>(select.current[0]); // 한 페이지당 보여질 글 개수
  // 검색어 state
  const [searchState, setSearchState] = useState<{text: string, type: string}>({
    text: '',
    type: '',
  });
  const {
    boardState: afreecaBoard,
    pagenationHandler: afreecaPagenationHandler,
    handlePostsLoad: afreecaPostLoadHandler,
    changeFilter: changeAfreecaFilter,
    initializeFilter: initializeAfreecaFilter,
  } = useBoardState(); // 아프리카 게시판 상태, 핸들러
  const {
    boardState: twitchBoard,
    pagenationHandler: twitchPagenationHandler,
    handlePostsLoad: twitchPostLoadHandler,
    changeFilter: changeTwitchFilter,
    initializeFilter: initializeTwitchFilter,
  } = useBoardState();// 트위치 게시판 상태, 핸들러

  // 검색버튼 눌렀을 때 스크롤 될 엘리먼트 저장
  const scrollRef = useRef<any>();

  const initializeSearchState = useCallback(() => {
    setSearchState({ type: '', text: '' });
  }, []);

  const onSearch = useCallback((field: any, text: string) => {
    let searchColumn = '';
    if (field === '제목') {
      searchColumn = 'title';
    } else if (field === '작성자') {
      searchColumn = 'nickname';
    }
    setSearchState({ text, type: searchColumn });
    initializeAfreecaFilter();
    initializeTwitchFilter();
    scrollToContainerTop(scrollRef);
  }, [initializeAfreecaFilter, initializeTwitchFilter]);

  const afreecaBoardFilterHandler = (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => {
    initializeSearchState();
    changeAfreecaFilter(categoryFilter);
  };

  const twitchBoardFilterHandler = (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => {
    initializeSearchState();
    changeTwitchFilter(categoryFilter);
  };

  // memo 적용한 컴포넌트들, dependencies에 포함된 값이 바뀔때만 리렌더링 되도록 한다
  const SelectComponent = useMemo(() => (
    <SelectField handleCallback={setTake} value={take} select={select.current} />
  ), [take]);

  const AfreecaBoard = useMemo(() => (
    <BoardContainer
      platform="afreeca"
      take={take}
      selectComponent={SelectComponent}
      pagenationHandler={afreecaPagenationHandler}
      searchText={searchState.text}
      searchType={searchState.type}
      boardState={afreecaBoard}
      postFilterHandler={afreecaBoardFilterHandler}
      handlePostsLoad={afreecaPostLoadHandler}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [take, searchState, afreecaBoard]);

  const TwitchBoard = useMemo(() => (
    <BoardContainer
      platform="twitch"
      take={take}
      selectComponent={SelectComponent}
      pagenationHandler={twitchPagenationHandler}
      searchText={searchState.text}
      searchType={searchState.type}
      boardState={twitchBoard}
      postFilterHandler={twitchBoardFilterHandler}
      handlePostsLoad={twitchPostLoadHandler}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [take, searchState, twitchBoard]);

  return (
    <CommunityBoardCommonLayout>
      <ProductHero title="자유게시판" content="자유게시판입니다" />

      <div
        className={searchState.text ? classes.centerWrapper : classes.hide}
        ref={scrollRef}
      >
        <Typography>{`검색한 내용 : ${searchState.text}`}</Typography>
        <IconButton onClick={initializeSearchState}>
          <CancelIcon />
        </IconButton>
      </div>

      <div className={classes.centerWrapper}>
        <Grid
          container
          justify="space-around"
          alignItems="flex-start"
        >
          <Grid item className={classes.boardWrapper}>
            {AfreecaBoard}
          </Grid>
          <Grid item className={classes.boardWrapper}>
            {TwitchBoard}
          </Grid>

        </Grid>

      </div>

      <SearchForm
        className={classes.centerWrapper}
        onSearch={onSearch}
        selectOptions={['제목', '작성자']}
      />
    </CommunityBoardCommonLayout>

  );
}
