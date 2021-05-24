import React, {
  useMemo,
} from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import YoutubeHighlightListLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import useBoardState from '../../utils/hooks/useBoardListState';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import HighlightListContainer from '../../organisms/mainpage/youtubeHighlight/list/HighlightListContainer';
import YoutubeHighlightListHero from '../../organisms/mainpage/youtubeHighlight/YoutubeHighlightListHero';
import useMediaSize from '../../utils/hooks/useMediaSize';
import MobileYoutubeHighlightList from '../../organisms/mainpage/youtubeHighlight/MobileYoutubeHighlightList';

export const youtubeHighlightListLayout = makeStyles((theme) => ({
  searchForm: {
    padding: theme.spacing(0, '4%', 0, '4%'),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: theme.spacing(10, 0, 4, 0),
  },
  contentTitle: {
    margin: theme.spacing(5),
  },
}));

export default function YoutubeHighlightList(): JSX.Element {
  const classes = youtubeHighlightListLayout();
  const { isMobile } = useMediaSize();

  const {
    boardState: afreecaHighlightList,
    setList: afreecaLoadHandler,
  } = useBoardState({}); // 아프리카 유투브 편집점 상태, 핸들러

  const {
    boardState: twitchHighlightList,
    setList: twitchLoadHandler,
  } = useBoardState({});// 트위치 유투브 편집점 상태, 핸들러

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
      setList={afreecaLoadHandler}
      boardState={afreecaHighlightList}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [afreecaHighlightList]);

  const TwitchBoard = useMemo(() => (
    <HighlightListContainer
      platform="twitch"
      titleComponent={twitchTitleComponent}
      setList={twitchLoadHandler}
      boardState={twitchHighlightList}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [twitchHighlightList]);

  return (
    <YoutubeHighlightListLayout>

      {isMobile ? (
        <MobileYoutubeHighlightList
          afreecaBoard={AfreecaBoard}
          twitchBoard={TwitchBoard}
        />
      ) : (
        <>
          <YoutubeHighlightListHero />
          <div className={classes.contentTitle}>
            <Typography variant="h5" align="center" gutterBottom color="primary">
              탑 방송인들의 최신 방송 정보를 확인해 보세요!
            </Typography>
            <Typography variant="h5" align="center" gutterBottom color="primary">
              해당 방송인의 대시보드, 편집점, 방송분석 정보들을 보실 수 있습니다.
            </Typography>
          </div>
          <Grid
            container
            justify="space-around"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item xs={5}>{AfreecaBoard}</Grid>
            <Grid item xs={5}>{TwitchBoard}</Grid>
          </Grid>
        </>
      )}

    </YoutubeHighlightListLayout>
  );
}
