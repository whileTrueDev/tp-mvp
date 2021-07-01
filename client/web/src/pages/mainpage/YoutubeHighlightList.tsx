import React from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import YoutubeHighlightListLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import HighlightListContainer from '../../organisms/mainpage/youtubeHighlight/list/HighlightListContainer';
import YoutubeHighlightListHero from '../../organisms/mainpage/youtubeHighlight/YoutubeHighlightListHero';
import useMediaSize from '../../utils/hooks/useMediaSize';
import MobileYoutubeHighlightList from '../../organisms/mainpage/youtubeHighlight/MobileYoutubeHighlightList';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../assets/constants';

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
  boardWrapper: {
    maxWidth: RANKING_PAGE_CONTAINER_WIDTH,
    margin: '0 auto',
  },
}));

export default function YoutubeHighlightList(): JSX.Element {
  const classes = youtubeHighlightListLayout();
  const { isMobile } = useMediaSize();

  return (
    <YoutubeHighlightListLayout>

      {isMobile ? (
        <MobileYoutubeHighlightList
          afreecaBoard={(
            <HighlightListContainer
              platform="afreeca"
            />
          )}
          twitchBoard={(
            <HighlightListContainer
              platform="twitch"
            />
          )}
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
            className={classes.boardWrapper}
            spacing={2}
          >
            <Grid item xs={6}>
              <HighlightListContainer
                platform="afreeca"
              />
            </Grid>
            <Grid item xs={6}>
              <HighlightListContainer
                platform="twitch"
              />
            </Grid>
          </Grid>
        </>
      )}

    </YoutubeHighlightListLayout>
  );
}
