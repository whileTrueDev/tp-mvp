import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Button from '../../../atoms/Button/Button';
import MetricTitle from '../../shared/sub/MetricTitle';
import MetricsTable from '../../shared/sub/MetricsTable';
import { initialPoint } from './TruepointHighlight';
import Chart from './Chart';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  wraper: {
    padding: theme.spacing(4),
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
}));

interface MetricsAccordianProps {
  metricsData: any;
  analysisWord?: string;
}

export default function MetricsAccordian(
  {
    metricsData,
    analysisWord,
  }: MetricsAccordianProps,
): JSX.Element {
  const classes = styles();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [point, setPoint] = React.useState(initialPoint);
  const [page2, setPage2] = React.useState(0);
  const [pageSize2, setPageSize2] = React.useState(5);
  const [point2, setPoint2] = React.useState(initialPoint);
  // const [page3, setPage3] = React.useState(0);
  // const [pageSize3, setPageSize3] = React.useState(5);
  // const [point3, setPoint3] = React.useState(initialPoint);

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
              pointNumber={metricsData.chat_points.length}
            />
            <Grid container direction="column" justify="center">
              <Grid item md={12}>
                <Chart
                  data={metricsData.chat_points}
                  chartType="chat"
                  highlight={point}
                  handleClick={setPoint}
                  handlePage={setPage}
                  pageSize={pageSize}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={metricsData.chat_points}
                  handleClick={setPoint}
                  row={point}
                  page={page}
                  pageSize={pageSize}
                  handlePage={setPage}
                  handlePageSize={setPageSize}
                  type="채팅 기반 편집점"
                />
                <div className={classes.buttonWraper}>
                  <Button
                    onClick={() => {
                      /**
                      * @hwasurr 2020.10.13 eslint error 처리 도중 처리
                      * 빈 화살표 함수 => 이후 처리 바람
                      * */
                    }}
                    style={{ color: 'white' }}
                  >
                    편집점 내보내기
                  </Button>
                </div>
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
              pointNumber={metricsData.smile_points.length}
            />
            <Grid container direction="column" justify="center">
              <Grid item md={12}>
                <Chart
                  data={metricsData.smile_points}
                  chartType="smile"
                  highlight={point2}
                  handleClick={setPoint2}
                  handlePage={setPage2}
                  pageSize={pageSize2}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={metricsData.smile_points}
                  handleClick={setPoint2}
                  row={point2}
                  page={page2}
                  pageSize={pageSize2}
                  handlePage={setPage2}
                  handlePageSize={setPageSize2}
                  type="웃음 발생 수 기반 편집점"
                />
                <div className={classes.buttonWraper}>
                  <Button
                    onClick={() => {
                      /**
                      * @hwasurr 2020.10.13 eslint error 처리 도중 처리
                      * 빈 화살표 함수 => 이후 처리 바람
                      * */
                    }}
                    style={{ color: 'white' }}
                  >
                    편집점 내보내기
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {analysisWord && (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>
            {`"${analysisWord}"`}
            {' '}
            카테고리 기반 편집점
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.wraper}>
          <Grid item md={12}>
            <MetricTitle
              subTitle={`"${analysisWord}" 카테고리 편집점`}
              iconSrc="/images/analyticsPage/logo_search.svg"
              pointNumber={metricsData.smile_points.length}
            />
            <Grid container direction="column" justify="center">
              <Grid item md={12}>
                <Chart
                  data={metricsData.smile_points}
                  chartType="smile"
                  highlight={point2}
                  handleClick={setPoint2}
                  handlePage={setPage2}
                  pageSize={pageSize2}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={metricsData.smile_points}
                  handleClick={setPoint2}
                  row={point2}
                  page={page2}
                  pageSize={pageSize2}
                  handlePage={setPage2}
                  handlePageSize={setPageSize2}
                  type={`"${analysisWord}" 카테고리 기반 편집점`}
                />
                <div className={classes.buttonWraper}>
                  <Button
                    onClick={() => {
                      /**
                       * @hwasurr 2020.10.13 eslint error 처리 도중 처리
                       * 빈 화살표 함수 => 이후 처리 바람
                       * */
                    }}
                    style={{ color: 'white' }}
                  >
                    편집점 내보내기
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      )}

    </Paper>
  );
}
