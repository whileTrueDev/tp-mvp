import React from 'react';
import ReactWordcloud from 'react-wordcloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import dummy from './dummy';

type MinMaxPair = [number, number];
const sizeNum: MinMaxPair = [5, 60];
const rotNum: MinMaxPair = [0, 0];
const options = {
  colors: ['#4b5ac7', '#929ef8'],
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: sizeNum,
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: rotNum,
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

function WordCloud(): JSX.Element {
  return (
    <div>
      <p>Configure options in the code editor!</p>
      <div style={{ height: 400, width: 600 }}>
        <ReactWordcloud options={options} words={dummy} />
      </div>
    </div>
  );
}
export default WordCloud;
