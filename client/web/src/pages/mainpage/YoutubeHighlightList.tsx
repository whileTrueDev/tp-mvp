import React, {
  useMemo, useCallback, useState, useRef,
} from 'react';
import {
  Grid, IconButton, InputLabel, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import YoutubeHighlightListLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import SearchForm from '../../organisms/mainpage/communityBoard/list/SearchForm';
import useBoardState from '../../utils/hooks/useBoardListState';
import SelectField from '../../atoms/SelectField';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import HighlightListContainer from '../../organisms/mainpage/youtubeHighlight/list/HighlightListContainer';

const youtubeHighlightListLayout = makeStyles((theme) => ({
  root: {
    minWidth: '1400px',
  },
  searchForm: {
    padding: theme.spacing(0, '14%', 0, '14%'),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: theme.spacing(10, 0, 4, 0),
  },
  centerWrapper: {
    width: '100%',
    minWidth: '1400px', // <ProductHero/>의 minWidth에 맞춤
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  beforeSearch: {
    paddingLeft: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  afterSearch: {
    visibility: 'hidden',
    height: 56,
  },
}));

export default function YoutubeHighlightList(): JSX.Element {
  const classes = youtubeHighlightListLayout();
  const select = useRef<number[]>([20, 30]); // 한 페이지당 보여질 글 개수 select 옵션
  const [take, setTake] = useState<number>(select.current[0]); // 한 페이지당 보여질 글 개수

  const [searchState, setSearchState] = useState<{text: string, type: string}>({
    text: '',
    type: '',
  });

  const {
    boardState: afreecaHighlightList,
    pagenationHandler: afreecaPagenationHandler,
    handlePostsLoad: afreecaPostLoadHandler,
  } = useBoardState({}); // 아프리카 유투브 편집점 상태, 핸들러

  const {
    boardState: twitchHighlightList,
    pagenationHandler: twitchPagenationHandler,
    handlePostsLoad: twitchPostLoadHandler,
  } = useBoardState({});// 트위치 유투브 편집점 상태, 핸들러

  const initializeSearchState = useCallback(() => {
    setSearchState({ type: '', text: '' });
  }, []);

  const onSearch = useCallback((field: string, text: string) => {
    let searchColumn = '';
    if (field === '방송인') {
      searchColumn = 'creatorName';
    }
    setSearchState({ text, type: searchColumn });
  }, []);

  // memo 적용한 컴포넌트들, dependencies에 포함된 값이 바뀔때만 리렌더링 되도록 한다
  const SelectComponent = useMemo(() => (
    <>
      <InputLabel id="post-count-select-label">표시 인원</InputLabel>
      <SelectField
        labelId="post-count-select-label"
        handleCallback={setTake}
        value={take}
        select={select.current}
      />
    </>

  ), [take]);

  const afreecaTitleComponent = useMemo(() => (
    <BoardTitle platform="afreeca" boardType />
  ), []);
  const twitchTitleComponent = useMemo(() => (
    <BoardTitle platform="twitch" boardType />
  ), []);

  const AfreecaBoard = useMemo(() => (
    <HighlightListContainer
      titleComponent={afreecaTitleComponent}
      platform="afreeca"
      take={take}
      selectComponent={SelectComponent}
      pagenationHandler={afreecaPagenationHandler}
      searchText={searchState.text}
      searchType={searchState.type}
      boardState={afreecaHighlightList}
      handlePostsLoad={afreecaPostLoadHandler}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [take, searchState, afreecaHighlightList]);

  const TwitchBoard = useMemo(() => (
    <HighlightListContainer
      platform="twitch"
      titleComponent={twitchTitleComponent}
      take={take}
      selectComponent={SelectComponent}
      pagenationHandler={twitchPagenationHandler}
      searchText={searchState.text}
      searchType={searchState.type}
      boardState={twitchHighlightList}
      handlePostsLoad={twitchPostLoadHandler}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [take, searchState, twitchHighlightList]);

  return (
    <YoutubeHighlightListLayout>
      <ProductHero
        title="유튜브 편짐점 제공"
        content={'시청자들이 재밌게 보았던 시간을 찾아드립니다! \n유튜브 편집시 놓치지 말고 활용 해보세요!'}
      />

      <div className={classes.searchForm}>
        <SearchForm
          onSearch={onSearch}
          selectOptions={['방송인']}
        />

        <div
          className={searchState.text ? classes.beforeSearch : classes.afterSearch}
        >
          <Typography>{`현재 검색한 방송인 : ${searchState.text}`}</Typography>
          <IconButton onClick={initializeSearchState}>
            <CancelIcon />
          </IconButton>
        </div>
      </div>

      <Grid container direction="row" spacing={10} justify="center" alignItems="center">
        <Grid item>
          {AfreecaBoard}
        </Grid>

        <Grid item>
          {TwitchBoard}
        </Grid>
      </Grid>

    </YoutubeHighlightListLayout>
  );
}
