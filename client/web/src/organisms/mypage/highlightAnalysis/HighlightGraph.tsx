import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {rank} from '../../shared/sub/MetricsTable';

interface Graphstyle {
  classes: any,
  highlight: any,
  handleClick: (a: any) => void,
  handlePage: any,
  pageSize: number,
  data: any,
  type: string
}

export default function HighlightGraph({
  classes,
  highlight,
  handleClick,
  handlePage,
  pageSize,
  data,
  type
}: Graphstyle): JSX.Element {
  const highlightStyleSheet = makeStyles(classes);
  const design = highlightStyleSheet();

  function caseByPoint(score: number): string {
    let className;
    if (score <= 34) {
      className = design.lower;
    } else if (score > 34 && score < 67) {
      className = design.middle;
    } else {
      className = design.high;
    }
    return className;
  }
  
  const dataType = (innerDataType:string): any => {
    let highlightType;
    switch (innerDataType) {
      case '채팅 기반 편집점':
        highlightType = data.chat_points;
        break;
      case '웃음 기반 편집점':
        highlightType = data.smile_points;
        break;
      default:
        highlightType = data.highlight_points
        break;
    }
    return highlightType;
  }

  const dataArray = dataType(type)

  return (
    <div className={design.root}>
      <div className={type === '트루포인트 편집점' ? design.gridChecker : design.gridChecker2}>
        { highlight.start_index && (
          <div
            style={{ gridColumn: `${highlight.start_index} / ${Number(highlight.end_index) + 1}`, gridRow: 1 }}
            className="timelineChecker"
          />
        )}
      </div>
      <div className={type === '트루포인트 편집점' ? design.wraper : design.wraper2}>
        <svg className={design.arrowSVG}>
          <polyline points="0,0 15,10 0,20" />
        </svg>
        <div className={type === '트루포인트 편집점' ? design.grid : design.grid2}>
          {dataArray.map((point:any, index:number) => (
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
                  ? (design.clickedPoint)
                  : (caseByPoint(point.score))
              }
              onClick={() => {handleClick({
                start_index: point.start_index,
                end_index: point.end_index,
                rank: rank(point, [...dataArray]),
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