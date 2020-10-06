import React from 'react';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MetricsTable from '../../shared/sub/MetricsTable';
import MetricsTitle from '../../shared/sub/MetricsTitle';
import Button from '../../../atoms/Button/Button';
import HighlightGraph from './HighlightGraph';
import Chart from './Chart';

const styles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(2)}px 0px`,
    padding: theme.spacing(4)
  },
  wraper: {
    padding: theme.spacing(4)
  },
  graphWraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  contentRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonWraper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20
  },
  contentLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rank: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 30,
    fontWeight: 700,
    textAlign: 'center',
    color: '#ff3e7a',
    '&>span': {
      color: 'black',
      fontSize: 20
    }
  },
  detailWraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: 250,
    height: 120,
  },
  detail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 30,
    margin: '10px 0px 0px 0px',
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 12,
    borderLeft: '3px solid #ff3e7a',
    backgroundColor: '#EBECEE',
    paddingLeft: 10
  },
  beforeClcik: {
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 15,
    wordBreak: 'keep-all'
  }
}));


const testData = {
  videoId: '39667416302',
  start_date: '2020-09-14',
  end_date: '2020-09-13',
  total_index: 120,
  highlight_points: [
    { start_time: '2020-09-13 09:55:00', end_time: '2020-09-13 09:55:00', start_index: '3', end_index: '3', score: 30 },
    { start_time: '2020-09-13 21:56:00', end_time: '2020-09-13 21:57:00', start_index: '10', end_index: '12', score: 33 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '30', end_index: '30', score: 33 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '40', end_index: '40', score: 34 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '60', end_index: '70', score: 50 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '71', end_index: '72', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '73', end_index: '74', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '75', end_index: '76', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '77', end_index: '78', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '79', end_index: '80', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '81', end_index: '82', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '83', end_index: '84', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '85', end_index: '86', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '87', end_index: '88', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '89', end_index: '90', score: 90 },
    { start_time: '2020-09-13 21:58:30', end_time: '2020-09-13 21:58:30', start_index: '95', end_index: '99', score: 90 },
  ]
};

export const graphCSS = {
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
  grid: {
    width: 922,
    height: 'auto',
    display: 'grid',
    gridTemplateColumns: `repeat(${testData.total_index}, 1fr)`,
    gridTemplateRows: '20px',
    background: 'repeating-linear-gradient(90deg, #fff, #fff 1px, #E9EAF3 0, #E9EAF3 3px)'
  },
  grid2: {
    width: 600,
    height: 'auto',
    display: 'grid',
    gridTemplateColumns: `repeat(${testData.total_index}, 1fr)`,
    gridTemplateRows: '20px',
    background: 'repeating-linear-gradient(90deg, #fff, #fff 1px, #E9EAF3 0, #E9EAF3 3px)'
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
  gridChecker: {
    marginLeft: 30,
    width: 922,
    height: 5,
    display: 'grid',
    gridTemplateColumns: `repeat(${testData.total_index}, 1fr)`,
    gridGap: 0,
    '&>.timelineChecker': {
      height: 5,
      backgroundColor: '#ff3e7a',
      borderRadius: 3
    }
  },
  gridChecker2: {
    marginLeft: 30,
    width: 600,
    height: 5,
    display: 'grid',
    gridTemplateColumns: `repeat(${testData.total_index}, 1fr)`,
    gridGap: 0,
    '&>.timelineChecker': {
      height: 5,
      backgroundColor: '#ff3e7a',
      borderRadius: 3
    }
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
      background: 'linear-gradient(to right, #f0a9b3, #ff3e7a)',
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
};

export const initialPoint = {
  startTime: '',
  endTime: '',
  start_index: '',
  end_index: '',
  score: '',
  rank: '',
  index: -1
};

export default function TruepointHighlight(): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [point, setPoint] = React.useState(initialPoint);
  const classes = styles();

  return (
    <Paper className={classes.root}>
      <Grid item className={classes.wraper}>
        <MetricsTitle
          mainTitle="편짐점 분석 대시보드"
          subTitle="트루포인트의 편집점"
          iconSrc="/images/logo/truepointLogo.png"
          pointNumber={testData.highlight_points.length}
        />
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid container direction="row" alignItems="center" justify="space-around">
            <Grid item md={7}>
              { point.rank && (
                <div className={classes.contentLeft}>
                  <div className={classes.rank}>
                    {point.rank}위
                    <span>편집점</span>
                  </div>
                </div>)
              }
              <Chart
                data={testData.highlight_points}
                chartType="highlight"
                highlight={point}
                handleClick={setPoint}
                handlePage={setPage}
                pageSize={pageSize}
              />
            </Grid>
            <Grid item md={5} className={classes.contentRight}>
              <div className={classes.buttonWraper}>
                <Button onClick={() => {window.open("/")}} style={{color: 'white'}}>
                  편집점 알아보기
                  {/* 여기 클릭 이벤트에 공지사항 - 편집점 이용 안내에 대한 페이지로 이동 시킬 예정 */}
                </Button>
                <Button onClick={() => {}} style={{color: 'white', marginLeft: 20}}>
                  편집점 내보내기
                </Button>
              </div>
              <MetricsTable
                metrics={testData.highlight_points}
                title="하이라이트 정보"
                handleClick={setPoint}
                row={point}
                page={page}
                pageSize={pageSize}
                handlePage={setPage}
                handlePageSize={setPageSize}
                type="트루포인트 편집점"
              />
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item md={12} className={classes.graphWraper}>
              <HighlightGraph
                data={testData}
                classes={graphCSS}
                highlight={point}
                handleClick={setPoint}
                handlePage={setPage}
                pageSize={pageSize}
                type="트루포인트 편집점"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
