import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Divider, Typography, Grid } from '@material-ui/core';
import MetricsTable, {rank} from '../../shared/sub/MetricsTable';
import Button from '../../../atoms/Button/Button';

const styles = makeStyles((theme) => ({
  root: {
    margin: `${theme.spacing(2)}px 0px`,
    padding: theme.spacing(4)
  },
  wraper: {
    padding: theme.spacing(4)
  },
  hr: {
    margin: `${theme.spacing(1)}px 0px`,
    backgroundColor: theme.palette.primary.main,
    height: theme.spacing(0.5)
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: `${theme.spacing(1)}px 0px`,
  },
  content: {
    fontSize: 22,
    fontWeight: 600
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(4)
  },
  contentWraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  contentSub: {
    textAlign: 'center',
    width: 500,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 18,
    padding: theme.spacing(2),
    backgroundColor: '#d9dbe6',
    borderRadius: 4,
    marginLeft: theme.spacing(4)
  },
  quotes: {
    width: 18,
    height: 18,
    margin: theme.spacing(1)
  },
  point: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 24,
    fontWeight: 700,
    margin: `0px ${theme.spacing(1)}px`
  },
  svg: {
    marginLeft: theme.spacing(10),
    width: 20,
    height: 10,
    fill: '#d9dbe6',
    stroke: '#d9dbe6',
    strokeWidth: '1px',
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
    height: 300,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 30,
    fontWeight: 700,
    textAlign: 'center'
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
  }
}));

interface Graphstyle {
  classes: any,
  highlight: any,
  handleClick: (a: any) => void,
  handlePage: any,
  pageSize: number
}

const testData = {
  videoId: '39667416302',
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

function HighlightGraph({
  classes,
  highlight,
  handleClick,
  handlePage,
  pageSize
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

  return (
    <div className={design.root}>
      <div className={design.gridChecker}>
        { highlight.start_index && (
          <div
            style={{ gridColumn: `${highlight.start_index} / ${Number(highlight.end_index) + 1}`, gridRow: 1 }}
            className="timelineChecker"
          />
        )}
      </div>
      <div className={design.wraper}>
        <svg className={design.arrowSVG}>
          <polyline points="0,0 15,10 0,20" />
        </svg>
        <div className={design.grid}>
          {testData.highlight_points.map((point, index) => (
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
                rank: rank(point, [...testData.highlight_points]),
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

export default function TruepointHighlight(): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const initialPoint = {
    startTime: '',
    endTime: '',
    start_index: '',
    end_index: '',
    score: '',
    rank: '',
    index: -1
  };
  const [point, setPoint] = React.useState(initialPoint);
  const classes = styles();

  const graphCSS = {
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
    grid: {
      width: 922,
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
        // background: 'linear-gradient(to right, #f0a9b3, #ff3e7a)',
        backgroundColor: '#ff3e7a',
        borderRadius: 3
      }
    },
    timelineChecker: {
      height: 5,
      // background: 'linear-gradient(to right, #f0a9b3, #ff3e7a)',
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
        // background: 'linear-gradient(to right, #f0a9b3, #ff3e7a)',
        backgroundColor: '#ff3e7a',
      }
    },
    high: {
      backgroundColor: '#495DF9',
      '&:hover': {
        cursor: 'pointer',
        // background: 'linear-gradient(to right, #f0a9b3, #ff3e7a)',
        backgroundColor: '#ff3e7a',
      }
    },
    clickedPoint: {
      // background: 'linear-gradient(to right, #f0a9b3, #ff3e7a)',
      backgroundColor: '#ff3e7a',
    }
  }

  return (
    <Paper className={classes.root}>
      <Grid item className={classes.wraper}>
        <Grid item xs={3}>
          <Divider variant="middle" className={classes.hr} />
        </Grid>
        <Typography variant="h4" className={classes.title}>
          편집점 분석 대시보드
        </Typography>
        <Grid container direction="row" alignItems="center">
          <Grid item className={classes.logo}>
            <img src="/images/logo/truepointLogo.png" alt="truepointLogo" />
            <Typography variant="body1" className={classes.content}>
              트루포인트의 편집점
            </Typography>
          </Grid>
          <Grid item className={classes.contentWraper}>
            <Grid item className={classes.contentSub}>
              <img src="/images/analyticsPage/quotesLeft.png" alt="quotes" className={classes.quotes} />
              분석된 하이라이트 포인트는
              <span className={classes.point}>{testData.highlight_points.length}개</span>
              입니다.
              <img src="/images/analyticsPage/quotesRight.png" alt="quotes" className={classes.quotes} />
            </Grid>
            <svg className={classes.svg}>
              <polyline points="0,0 10,10 20,0" />
            </svg> 
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid container direction="row" alignItems="flex-end" justify="space-around">
            <Grid item md={7}>
              { point.rank && (
                <div className={classes.contentLeft}>
                  <div className={classes.rank}>
                    {point.rank}
                  </div>
                  <div className={classes.detailWraper}>
                    <div className={classes.detail}>채팅 발생수 : 13</div>
                    <div className={classes.detail}>웃음 발생수 : 13</div>
                    <div className={classes.detail}>추후 지표 업데이트 예정</div>
                  </div>
                </div>
              )}
            </Grid>
            <Grid item md={5} className={classes.contentRight}>
              <div className={classes.buttonWraper}>
                <Button onClick={() => {}} style={{color: 'white'}}>
                  편집점 알아보기
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
              />
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item md={12} className={classes.graphWraper}>
              <HighlightGraph
                classes={graphCSS}
                highlight={point}
                handleClick={setPoint}
                handlePage={setPage}
                pageSize={pageSize}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

