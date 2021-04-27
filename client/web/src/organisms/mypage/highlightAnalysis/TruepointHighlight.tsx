import React, { useMemo } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import MetricsTable from '../../shared/sub/MetricsTable';
import MetricTitle from '../../shared/sub/MetricTitle';
import Button from '../../../atoms/Button/Button';
import HighlightExport from '../../shared/sub/HighlightExport';
import ScorePicker from './ScorePicker';
import HelperPopOver from '../../shared/HelperPopOver';
import Highcharts from './HighChart';

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
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 20,
  },
  contentLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailWraper: {
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

    fontSize: 12,
    borderLeft: `3px solid ${theme.palette.error.main}`,
    backgroundColor: '#EBECEE',
    paddingLeft: 10,
  },
  beforeClcik: {
    textAlign: 'center',

    fontSize: 15,
    wordBreak: 'keep-all',
  },
  button: {
    color: theme.palette.common.white,
    margin: `.3125rem 0px .3125rem ${theme.spacing(2)}px`,
  },
  helperPopOver: { textAlign: 'right' },
}));

export interface InitialPoint {
  startTime: string
  endTime: string
  start_index: string
  end_index: string
  score: string
  index: number
}

export const initialPoint = {
  startTime: '',
  endTime: '',
  start_index: '',
  end_index: '',
  score: '',
  index: -1,
};

interface TruepointHighlightProps {
  highlightData: any;
  selectedStream: StreamDataType | null
}

export default function TruepointHighlight({
  highlightData,
  selectedStream,
}: TruepointHighlightProps): JSX.Element {
  const classes = styles();
  const [picked90, setPicked90] = React.useState(true);
  const highlight97 = useMemo(() => highlightData.highlight_points_97.map((point: number) => ({
    ...highlightData.highlight_points[point],
  })), [highlightData]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [point, setPoint] = React.useState(initialPoint);

  return (
    <Paper className={classes.root}>
      <Grid item className={classes.wraper}>
        <MetricTitle
          mainTitle="편집점 분석 대시보드"
          subTitle="트루포인트의 편집점"
          iconSrc="/images/logo/truepointLogo.png"
          pointNumber={picked90 ? highlightData.highlight_points_97.length : highlightData.highlight_points.length}
        />
        <Grid container direction="column" justify="center">
          <Grid item md={12}>
            <ScorePicker
              picked90={picked90}
              setPicked90={setPicked90}
              setPage={setPage}
              setPageSize={setPageSize}
              setPoint={setPoint}
            />
            <Highcharts
              data={picked90 ? highlight97 : highlightData.highlight_points}
              totalData={highlightData.highlight_total_data}
              dataOption={{
                boundary: picked90 ? highlightData.boundary_97.highlight : highlightData.boundary.highlight,
              }}
              chartType="highlight"
              highlight={point}
              handleClick={setPoint}
              handlePage={setPage}
              pageSize={pageSize}
            />
          </Grid>
          <Grid item md={12} className={classes.contentRight}>
            <MetricsTable
              metrics={picked90 ? highlight97 : highlightData.highlight_points}
              handleClick={setPoint}
              row={point}
              page={page}
              pageSize={pageSize}
              handlePage={setPage}
              handlePageSize={setPageSize}
              type="트루포인트 편집점"
            />
            <div className={classes.buttonWraper}>
              <HighlightExport
                selectedStream={selectedStream}
                exportCategory="highlight"
              />
              <div>
                <div className={classes.helperPopOver}>
                  <HelperPopOver />
                </div>
                <Button
                  className={classes.button}
                  onClick={() => window.open('https://drive.google.com/file/d/16OfhD-tPMURm2DOXGqEJdywg5JOLfJKs/view?usp=sharing', '_blank')}
                  // s3 링크는 아래.
                  // https://truepoint.s3.ap-northeast-2.amazonaws.com/tp-introduction/201014+%E1%84%90%E1%85%B3%E1%84%85%E1%85%AE%E1%84%91%E1%85%A9%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%90%E1%85%B3+%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3+%E1%84%8C%E1%85%B5%E1%86%AB%E1%84%92%E1%85%A2%E1%86%BC+%E1%84%80%E1%85%A9%E1%86%BC%E1%84%8B%E1%85%B2%E1%84%8B%E1%85%AD%E1%86%BC++(1).pdf
                >
                  편집점 알아보기
                </Button>
              </div>

            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
