import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Button from '../../../atoms/Button/Button';
import MetricTitle from '../../shared/sub/MetricTitle';
import MetricsTable from '../../shared/sub/MetricsTable';
import { initialPoint } from './TruepointHighlight';
import Chart from './Chart';

interface PointType {
  start_time: string;
  end_time: string;
  start_index: string;
  end_index: string;
  score: any;
}

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  wraper: {
    padding: theme.spacing(4)
  },
  heading: {
    fontSize: 20,
    fontFamily: 'AppleSDGothicNeo',
    fontWeight: 600,
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
}));

// S3로 부터 호출되는 데이터
const metricsTestData = {
  videoId: 173919802,
  start_date: '2020-09-16 18:21:00',
  end_date: '2020-09-16 18:39:30',
  total_index: 38,
  time_line: [{ smile_count: 2, chat_count: 0.0 },
    { smile_count: 8, chat_count: 8.0 },
    { smile_count: 5, chat_count: 2.0 },
    { smile_count: 3, chat_count: 0.0 },
    { smile_count: 1, chat_count: 2.0 },
    { smile_count: 2, chat_count: 1.0 },
    { smile_count: 4, chat_count: 11.0 },
    { smile_count: 3, chat_count: 0.0 },
    { smile_count: 4, chat_count: 3.0 },
    { smile_count: 3, chat_count: 16.0 },
    { smile_count: 0, chat_count: 0.0 },
    { smile_count: 1, chat_count: 0.0 },
    { smile_count: 4, chat_count: 13.0 },
    { smile_count: 1, chat_count: 0.0 },
    { smile_count: 1, chat_count: 0.0 },
    { smile_count: 2, chat_count: 2.0 },
    { smile_count: 3, chat_count: 5.0 },
    { smile_count: 3, chat_count: 0.0 },
    { smile_count: 6, chat_count: 0.0 },
    { smile_count: 5, chat_count: 0.0 },
    { smile_count: 3, chat_count: 2.0 },
    { smile_count: 3, chat_count: 3.0 },
    { smile_count: 5, chat_count: 10.0 },
    { smile_count: 2, chat_count: 16.0 },
    { smile_count: 4, chat_count: 0.0 },
    { smile_count: 5, chat_count: 6.0 },
    { smile_count: 6, chat_count: 3.0 },
    { smile_count: 3, chat_count: 0.0 },
    { smile_count: 3, chat_count: 0.0 },
    { smile_count: 1, chat_count: 0.0 },
    { smile_count: 0, chat_count: 0.0 },
    { smile_count: 0, chat_count: 0.0 },
    { smile_count: 1, chat_count: 0.0 },
    { smile_count: 2, chat_count: 4.0 },
    { smile_count: 0, chat_count: 0.0 },
    { smile_count: 0, chat_count: 0.0 },
    { smile_count: 0, chat_count: 0.0 },
    { smile_count: 1, chat_count: 16.0 }],
  chat_points: [2, 5, 9, 10, 12, 15, 20, 22, 25, 27, 30],
  smile_points: [2, 5, 9, 10, 12, 15, 20, 22, 25, 27, 30]
};

// data에는 테스트 데이터, pointsType에는 smile_points 혹은 chat_points 들어감
const getMetricsPoint = (data:any): any => {
  const originStartTime = new Date(data.start_date);

  function getDate(index:number) {
    const Time = new Date(originStartTime.setSeconds(originStartTime.getSeconds() + 30 * index));
    const getYears = Time.getFullYear();
    const getMonths = Time.getMonth();
    const getDays = Time.getDay();
    const getHours = Time.getHours();
    const getMinutes = Time.getMinutes();
    const getSeconds = Time.getSeconds();
    const months = getMonths >= 10 ? String(getMonths) : `0${getMonths}`;
    const days = getDays >= 10 ? String(getDays) : `0${getDays}`;
    const hours = getHours >= 10 ? String(getHours) : `0${getHours}`;
    const minutes = getMinutes >= 10 ? String(getMinutes) : `0${getMinutes}`;
    const seconds = getSeconds >= 10 ? String(getSeconds) : `0${getSeconds}`;

    return `${getYears}-${months}-${days} ${hours}:${minutes}:${seconds}`;
  }

  function insertPoints(target: number, countType: string) {
    const time = getDate(target);
    const returnDict = {
      start_time: time, end_time: time, start_index: String(target), end_index: String(target), score: data.time_line[target][countType]
    };
    return returnDict;
  }

  const resultData: {chat_points: PointType[], smile_points: PointType[]} = {
    chat_points: [],
    smile_points: []
  };

  const chatHighlight = data.chat_points;
  const smileHighlight = data.smile_points;

  chatHighlight.forEach((item: number) => {
    const eachData = insertPoints(item, 'chat_count');
    resultData.chat_points.push(eachData);
  });

  smileHighlight.forEach((item: number) => {
    const eachData = insertPoints(item, 'smile_count');
    resultData.smile_points.push(eachData);
  });

  return resultData;
};

interface MetricsAccordianProps {
  metricsData: any;
}

export default function MetricsAccordian({ metricsData }: MetricsAccordianProps): JSX.Element {
  const metricsAllData = getMetricsPoint(metricsData);
  const classes = styles();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [point, setPoint] = React.useState(initialPoint);
  const [page2, setPage2] = React.useState(0);
  const [pageSize2, setPageSize2] = React.useState(5);
  const [point2, setPoint2] = React.useState(initialPoint);

  return (
    <Paper>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>채팅 발생 수 기반 편집점</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.wraper}>
          <Grid item md={12}>
            <MetricTitle
              subTitle="채팅 편집점"
              iconSrc="/images/analyticsPage/logo_chat.svg"
              pointNumber={metricsAllData.chat_points.length}
            />
            <Grid container direction="row" alignItems="center" justify="space-around">
              <Grid item md={7}>
                { point.rank && (
                  <div className={classes.contentLeft}>
                    <div className={classes.rank}>
                      {point.rank}
                      위
                      <span>편집점</span>
                    </div>
                  </div>
                )}
                <Chart
                  data={metricsAllData.chat_points}
                  chartType="chat"
                  highlight={point}
                  handleClick={setPoint}
                  handlePage={setPage}
                  pageSize={pageSize}
                />
              </Grid>
              <Grid item md={4} className={classes.contentRight}>
                <div className={classes.buttonWraper}>
                  <Button onClick={() => {}} style={{ color: 'white' }}>
                    편집점 내보내기
                  </Button>
                </div>
                <MetricsTable
                  metrics={metricsAllData.chat_points}
                  title="채팅 발생 정보"
                  handleClick={setPoint}
                  row={point}
                  page={page}
                  pageSize={pageSize}
                  handlePage={setPage}
                  handlePageSize={setPageSize}
                  type="채팅 기반 편집점"
                />
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>웃음 발생 수 기반 편집점</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.wraper}>
          <Grid item md={12}>
            <MetricTitle
              subTitle="웃음 편집점"
              iconSrc="/images/analyticsPage/logo_smile.svg"
              pointNumber={metricsAllData.smile_points.length}
            />
            <Grid container direction="row" alignItems="center" justify="space-around">
              <Grid item md={7}>
                { point2.rank && (
                  <div className={classes.contentLeft}>
                    <div className={classes.rank}>
                      {point2.rank}
                      위
                      <span>편집점</span>
                    </div>
                  </div>
                )}
                <Chart
                  data={metricsAllData.smile_points}
                  chartType="smile"
                  highlight={point2}
                  handleClick={setPoint2}
                  handlePage={setPage2}
                  pageSize={pageSize2}
                />
              </Grid>
              <Grid item md={4} className={classes.contentRight}>
                <div className={classes.buttonWraper}>
                  <Button onClick={() => {}} style={{ color: 'white' }}>
                    편집점 내보내기
                  </Button>
                </div>
                <MetricsTable
                  metrics={metricsAllData.smile_points}
                  title="웃음 발생 정보"
                  handleClick={setPoint2}
                  row={point2}
                  page={page2}
                  pageSize={pageSize2}
                  handlePage={setPage2}
                  handlePageSize={setPageSize2}
                  type="웃음 발생 수 기반 편집점"
                />
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
