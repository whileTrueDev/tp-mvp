import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
    width: '100%',
  },
  wraper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
  },
  firstContent: {
    width: 550,
  },
  arrowSVG: {
    width: 30,
    height: 20,
    fill: '#6c61ff',
    stroke: '#6c61ff',
    strokeWidth: '1px',
  },
  lower: {
    backgroundColor: theme.palette.primary.light,
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.error.main,
    },
  },
  middle: {
    backgroundColor: '#7E8CF7',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.error.main,
    },
  },
  high: {
    backgroundColor: '#495DF9',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.error.main,
    },
  },
  clickedPoint: {
    backgroundColor: theme.palette.error.main,
  },
  timelineTitle: {
    paddingLeft: 30,
    fontWeight: 700,
  },
}));

interface Graphstyle {
  classes: any;
  highlight: any;
  handleClick: (a: any) => void;
  handlePage: any;
  pageSize: number;
  data: any;
}

export default function HighlightGraph({
  classes,
  highlight,
  handleClick,
  handlePage,
  pageSize,
  data,
}: Graphstyle): JSX.Element {
  const highlightStyleSheet = makeStyles(classes);
  const design = highlightStyleSheet();
  const styling = styles();

  function caseByPoint(score: number): string {
    let className;
    if (score <= 34) {
      className = styling.lower;
    } else if (score > 34 && score < 67) {
      className = styling.middle;
    } else {
      className = styling.high;
    }
    return className;
  }

  return (
    <div className={styling.root}>
      <Typography display="inline" variant="h5" className={styling.timelineTitle}>타임라인</Typography>
      <Typography display="inline" variant="body1"> 방송 플레이타임 기준의 편집점 위치입니다</Typography>
      {/* <div>
        <span className={styling.timelineTitle}>타임라인</span>
        <span className={styling.timelineTitleSub}> 방송 플레이타임 기준의 편집점 위치입니다</span>
      </div> */}
      <div className={styling.wraper}>
        <svg className={styling.arrowSVG}>
          <polyline points="0,0 15,10 0,20" />
        </svg>
        <div className={design.grid}>
          {data.map((point: any, index: number) => (
            <div
              onKeyDown={() => {
                /**
                  * @hwasurr 2020.10.13 eslint error 처리 도중 처리
                  * 빈 화살표 함수 => 이후 처리 바람
                  * */
              }}
              tabIndex={0}
              role="button"
              aria-label="click highlight point"
              key={point.start_index}
              style={{
                gridColumn: `${point.start_index} / ${Number(point.end_index) + 1}`,
                gridRow: 1,
                height: 20,
              }}
              className={
                highlight.index === index
                  ? (styling.clickedPoint)
                  : (caseByPoint(point.score))
              }
              onClick={() => {
                handleClick({
                  start_index: point.start_index,
                  end_index: point.end_index,
                  index,
                });
                handlePage(Math.floor(index / pageSize));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
