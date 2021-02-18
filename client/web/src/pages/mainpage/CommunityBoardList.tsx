import { Grid, IconButton, Typography } from '@material-ui/core';
import React, { useCallback, useRef, useState } from 'react';
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
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  container: {
    width: '90%',
    minWidth: '1300px',
  },
  hide: {
    visibility: 'hidden',
  },
}));

export default function CommunityBoardList(): JSX.Element {
  const classes = useStyles();
  const select = useRef<number[]>([8, 16]);
  const [take, setTake] = useState<number>(select.current[0]);
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
  } = useBoardState();
  const {
    boardState: twitchBoard,
    pagenationHandler: twitchPagenationHandler,
    handlePostsLoad: twitchPostLoadHandler,
    changeFilter: changeTwitchFilter,
    initializeFilter: initializeTwitchFilter,
  } = useBoardState();
  const scrollRef = useRef<any>();

  const initializeSearchState = useCallback(() => {
    setSearchState({ type: '', text: '' });
  }, []);

  const onSearch = (field: any, text: string) => {
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
  };

  const afreecaBoardFilterHandler = (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => {
    initializeSearchState();
    changeAfreecaFilter(categoryFilter);
  };

  const twitchBoardFilterHandler = (event: React.MouseEvent<HTMLElement>, categoryFilter: FilterType) => {
    initializeSearchState();
    changeTwitchFilter(categoryFilter);
  };

  return (
    <CommunityBoardCommonLayout>
      <ProductHero title="자유게시판" content="자유게시판입니다" />

      <div
        className={searchState.text ? classes.center : classes.hide}
        ref={scrollRef}
      >
        <Typography>{`검색한 내용 : ${searchState.text}`}</Typography>
        <IconButton onClick={initializeSearchState}>
          <CancelIcon />
        </IconButton>
      </div>

      <div className={classes.center}>
        <Grid
          className={classes.container}
          container
          justify="space-around"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs={12} sm={6}>
            <BoardContainer
              platform="afreeca"
              take={take}
              selectComponent={(
                <SelectField
                  handleCallback={setTake}
                  value={take}
                  select={select.current}
                />
            )}
              pagenationHandler={afreecaPagenationHandler}
              searchText={searchState.text}
              searchType={searchState.type}
              boardState={afreecaBoard}
              postFilterHandler={afreecaBoardFilterHandler}
              handlePostsLoad={afreecaPostLoadHandler}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BoardContainer
              platform="twitch"
              take={take}
              selectComponent={<SelectField handleCallback={setTake} value={take} select={select.current} />}
              pagenationHandler={twitchPagenationHandler}
              searchText={searchState.text}
              searchType={searchState.type}
              boardState={twitchBoard}
              postFilterHandler={twitchBoardFilterHandler}
              handlePostsLoad={twitchPostLoadHandler}
            />
          </Grid>
        </Grid>
      </div>

      <SearchForm
        className={classes.center}
        onSearch={onSearch}
        selectOptions={['제목', '작성자']}
      />
    </CommunityBoardCommonLayout>

  );
}
