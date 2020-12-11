import React from 'react';
import ReactWordcloud from 'react-wordcloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { makeStyles, Grid } from '@material-ui/core';
import dummy from './dummy';

type MinMaxPair = [number, number];
type scale = 'undefined' | 'linear' | 'sqrt' | 'log' ;
const wordScale: scale = 'sqrt';
const sizeNum: MinMaxPair = [5, 60];
const rotNum: MinMaxPair = [0, 0];
const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 350,
    height: 950,
    width: 1200,
    justifyContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
    alignContent: 'center',
  },
}));
const options = {
  colors: ['#4b5ac7', '#929ef8'],
  enableTooltip: true,
  deterministic: false,
  fontSizes: sizeNum,
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  scale: wordScale,
  rotations: 3,
  rotationAngles: rotNum,
  transitionDuration: 1000,
};

function WordCloud(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} lg={10}>
            <ReactWordcloud options={options} words={dummy} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
export default WordCloud;
