import React from 'react';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MetricsTable from '../../shared/sub/MetricsTable';
import MetricTitle from '../../shared/sub/MetricTitle';
import Button from '../../../atoms/Button/Button';
import HighlightGraph from './HighlightGraph';
import Chart from './Chart';

const styles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(2)}px 0px`,
    padding: theme.spacing(4),
  },
  wraper: {
    padding: theme.spacing(4),
  },
  graphWraper: {
    paddingLeft: '30px',
    paddingRight: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: theme.spacing(3),
  },
  contentRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonWraper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
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
    color: theme.palette.success.main,
    '&>span': {
      color: 'black',
      fontSize: 20,
    },
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
    borderLeft: `3px solid ${theme.palette.success.main}`,
    backgroundColor: '#EBECEE',
    paddingLeft: 10,
  },
  beforeClcik: {
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 15,
    wordBreak: 'keep-all',
  },
}));

export const initialPoint = {
  startTime: '',
  endTime: '',
  start_index: '',
  end_index: '',
  score: '',
  rank: '',
  index: -1,
};

interface TruepointHighlightProps {
  highlightData: any;
}

export default function TruepointHighlight({
  highlightData,
}: TruepointHighlightProps): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [point, setPoint] = React.useState(initialPoint);
  const classes = styles();

  const graphCSS = {
    grid: {
      width: '100%',
      height: 'auto',
      display: 'grid',
      gridTemplateColumns: `repeat(${highlightData.total_index}, 1fr)`,
      gridTemplateRows: '20px',
      background: 'repeating-linear-gradient(90deg, #fff, #fff 1px, #E9EAF3 0, #E9EAF3 3px)',
    },
  };

  return (
    <Paper className={classes.root}>
      <Grid item className={classes.wraper}>
        <MetricTitle
          mainTitle="편짐점 분석 대시보드"
          subTitle="트루포인트의 편집점"
          iconSrc="/images/logo/truepointLogo.png"
          pointNumber={highlightData.highlight_points.length}
        />
        <Grid container direction="column" justify="center">
          <Grid item md={12}>
            <Chart
              data={highlightData.highlight_points}
              chartType="highlight"
              highlight={point}
              handleClick={setPoint}
              handlePage={setPage}
              pageSize={pageSize}
            />
          </Grid>
          <Grid item md={12} className={classes.graphWraper}>
            <HighlightGraph
              data={highlightData}
              classes={graphCSS}
              highlight={point}
              handleClick={setPoint}
              handlePage={setPage}
              pageSize={pageSize}
            />
          </Grid>
          <Grid item md={12} className={classes.contentRight}>
            <MetricsTable
              metrics={highlightData.highlight_points}
              handleClick={setPoint}
              row={point}
              page={page}
              pageSize={pageSize}
              handlePage={setPage}
              handlePageSize={setPageSize}
              type="트루포인트 편집점"
            />
            <div className={classes.buttonWraper}>
              <Button
                onClick={() => {
                  window.open('/');
                }}
                style={{ color: 'white' }}
              >
                편집점 알아보기
                {/* 여기 클릭 이벤트에 공지사항 - 편집점 이용 안내에 대한 페이지로 이동 시킬 예정 */}
              </Button>
              <Button
                onClick={() => {
                  /**
                  * @hwasurr 2020.10.13 eslint error 처리 도중 처리
                  * 빈 화살표 함수 => 이후 처리 바람
                  * */
                }}
                style={{ color: 'white', marginLeft: 20 }}
              >
                편집점 내보내기
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
