import React, {
  useMemo,
} from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import YoutubeHighlightListLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import useBoardState from '../../utils/hooks/useBoardListState';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import HighlightListContainer from '../../organisms/mainpage/youtubeHighlight/list/HighlightListContainer';

const youtubeHighlightListLayout = makeStyles((theme) => ({
  searchForm: {
    padding: theme.spacing(0, '4%', 0, '4%'),
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
    padding: theme.spacing(5, 2, 5, 2),
  },
  boardWrapper: {
    width: '45%',
  },
  contentTitle: {
    margin: theme.spacing(5),
  },
}));

export default function YoutubeHighlightList(): JSX.Element {
  const classes = youtubeHighlightListLayout();

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
      <ProductHero
        title="유튜브 편집점 및 방송분석 제공"
        content={'시청자들이 재밌게 보았던 시간을 찾아드립니다! \n유튜브 편집시 놓치지 말고 활용 해보세요!'}
      />

      <div className={classes.contentTitle}>
        <Typography variant="h5" align="center" gutterBottom color="primary">
          탑 방송인들의 최신 방송 정보를 확인해 보세요!
        </Typography>
        <Typography variant="h5" align="center" gutterBottom color="primary">
          해당 방송인의 대시보드, 편집점, 방송분석 정보들을 보실 수 있습니다.
        </Typography>
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

    </YoutubeHighlightListLayout>
  );
}
