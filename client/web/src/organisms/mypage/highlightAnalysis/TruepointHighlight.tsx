import React from 'react';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { Link } from 'react-router-dom';
import MetricsTable from '../../shared/sub/MetricsTable';
import MetricTitle from '../../shared/sub/MetricTitle';
import Button from '../../../atoms/Button/Button';
import HighlightGraph from './HighlightGraph';
import Chart from './Chart';
import HighlightExport from '../../shared/sub/HighlightExport';
import ScorePicker from './ScorePicker';

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
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 12,
    borderLeft: `3px solid ${theme.palette.error.main}`,
    backgroundColor: '#EBECEE',
    paddingLeft: 10,
  },
  beforeClcik: {
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 15,
    wordBreak: 'keep-all',
  },
  button: {
    color: theme.palette.common.white,
    margin: `.3125rem 0px .3125rem ${theme.spacing(2)}px`,
  },
}));

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
  const [picked90, setPicked90] = React.useState(true);
  const hightlight90 = highlightData.highlight_points_90.map((point: any) => ({
    ...highlightData.highlight_points[point],
  }));
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
          pointNumber={picked90 ? highlightData.highlight_points_90.length : highlightData.highlight_points.length}
        />
        <Grid container direction="column" justify="center">
          <Grid item md={12}>
            <ScorePicker picked90={picked90} setPicked90={setPicked90} />
            <Chart
              data={picked90 ? hightlight90 : highlightData.highlight_points}
              chartType="highlight"
              highlight={point}
              handleClick={setPoint}
              handlePage={setPage}
              pageSize={pageSize}
            />
          </Grid>
          <Grid item md={12} className={classes.graphWraper}>
            <HighlightGraph
              data={picked90 ? hightlight90 : highlightData.highlight_points}
              classes={graphCSS}
              highlight={point}
              handleClick={setPoint}
              handlePage={setPage}
              pageSize={pageSize}
            />
          </Grid>
          <Grid item md={12} className={classes.contentRight}>
            <MetricsTable
              metrics={picked90 ? hightlight90 : highlightData.highlight_points}
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
              <Button
                className={classes.button}
                link={Link}
                to="/notice/1"
              >
                편집점 알아보기
                {/* 여기 클릭 이벤트에 공지사항 - 편집점 이용 안내에 대한 페이지로 이동 시킬 예정 */}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
