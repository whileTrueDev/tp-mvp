import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { rank } from '../../shared/sub/MetricsTable';

const styles = makeStyles((theme) => ({
  root: {
    marginTop: 20
  },
  wraper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25
  },
  wraper2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 25
  },
  firstContent: {
    width: 550
  },
  arrowSVG: {
    width: 30,
    height: 20,
    fill: '#6c61ff',
    stroke: '#6c61ff',
    strokeWidth: '1px',
  },
  timelineChecker: {
    height: 5,
    backgroundColor: '#ff3e7a',
    borderRadius: 3
  },
  lower: {
    backgroundColor: '#a8c4f9',
    '&:hover': {
      cursor: 'pointer',
      background: '#ff3e7a',
    }
  },
  middle: {
    backgroundColor: '#7E8CF7',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#ff3e7a',
    }
  },
  high: {
    backgroundColor: '#495DF9',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#ff3e7a',
    }
  },
  clickedPoint: {
    backgroundColor: '#ff3e7a',
  }
}));

interface Graphstyle {
  classes: any,
  highlight: any,
  handleClick: (a: any) => void,
  handlePage: any,
  pageSize: number,
  data: any,
}

export default function HighlightGraph({
  classes,
  highlight,
  handleClick,
  handlePage,
  pageSize,
  data
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
      <div className={design.gridChecker}>
        { highlight.start_index && (
          <div
            style={{ gridColumn: `${highlight.start_index} / ${Number(highlight.end_index) + 1}`, gridRow: 1 }}
            className="timelineChecker"
          />
        )}
      </div>
      <div className={styling.wraper}>
        <svg className={styling.arrowSVG}>
          <polyline points="0,0 15,10 0,20" />
        </svg>
        <div className={design.grid}>
          {data.highlight_points.map((point:any, index:number) => (
            <div
              onKeyDown={() => {}}
              tabIndex={0}
              role="button"
              aria-label="click highlight point"
              key={point.start_index}
              style={{
                gridColumn: `${point.start_index} / ${Number(point.end_index) + 1}`,
                gridRow: 1,
                height: 20
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
                  rank: rank(point, [...data.highlight_points]),
                  index
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
