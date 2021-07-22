import React from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import {
  CreatorAverageScoresWithRank,
} from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import ScoreBar from '../ranking/topten/ScoreBar';
import { useScoreSectionStyles } from './ScoresSection.style';
import AdmireIcon from '../../../atoms/svgIcons/AdmireIcon';
import CussIcon from '../../../atoms/svgIcons/CussIcon';
import FrustratedIcon from '../../../atoms/svgIcons/FrustratedIcon';
import SmileIcon from '../../../atoms/svgIcons/SmileIcon';

/**
 * 감정점수 있는 부분
 */
 type columns = 'admire' | 'smile'|'frustrate'|'cuss';

const scoreLables: {name: columns, label: string, icon?: any}[] = [
  { name: 'admire', label: '감탄점수', icon: <AdmireIcon /> },
  { name: 'smile', label: '웃음점수', icon: <SmileIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <FrustratedIcon /> },
  { name: 'cuss', label: '욕점수', icon: <CussIcon /> },
];

export function ScoresSection({ scores }: {
  scores: CreatorAverageScoresWithRank
}): JSX.Element {
  const classes = useScoreSectionStyles();

  return (
    <>
      {scoreLables.map((score) => (
        <Grid container key={score.name} className={classes.scoreItemContainer}>
          <Grid item className={classes.scoreLabelContainer}>
            <Typography className={classes.scoreLabelText}>
              {score.icon}
            </Typography>
            <Typography className={classes.scoreLabelText}>
              {score.label}
            </Typography>
          </Grid>
          <Grid item className={classes.scoreBarContainer}>
            <ScoreBar
              total={scores.total}
              scoreRank={scores[`${score.name}Rank` as const]}
              score={scores[score.name]}
            />

          </Grid>
        </Grid>
      ))}
    </>
  );
}
