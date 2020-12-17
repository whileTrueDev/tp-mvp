import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid, Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PriorityHigh from '@material-ui/icons/PriorityHigh';
import Paper from '@material-ui/core/Paper';
import { CategoryGetRequest } from '@truepoint/shared/dist/dto/category/categoryGet.dto';
import shortid from 'shortid';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import MetricTitle from '../../shared/sub/MetricTitle';
import MetricsTable from '../../shared/sub/MetricsTable';
import HighlightExport from '../../shared/sub/HighlightExport';
import { initialPoint } from './TruepointHighlight';
import ScorePicker from './ScorePicker';
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
  selectedCategoryButton: {
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.primary.main,
  },
  categoryButton: {
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '&:hover': {
      transform: 'scale(1.04)',
      boxShadow: theme.shadows[5],
    },
  },
  selectedButtonTitle: {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
  timeDescription: {
    marginLeft: theme.spacing(2),
    fontWeight: 'bold',
  },
  mark: {
    fontSize: '17px',
  },
}));

interface MetricsAccordianProps {
  categories: CategoryGetRequest[];
  highlightData: any;
  selectedStream: StreamDataType|null;
}
type MetricsType = 'chat'|'smile'|'funny'|'agree'|'surprise'|'disgust'|'question'

export default function MetricsAccordian(
  {
    highlightData,
    categories,
    selectedStream,
  }: MetricsAccordianProps,
): JSX.Element {
  const classes = styles();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [point, setPoint] = React.useState(initialPoint);
  const [page2, setPage2] = React.useState(0);
  const [pageSize2, setPageSize2] = React.useState(5);
  const [point2, setPoint2] = React.useState(initialPoint);
  const [page3, setPage3] = React.useState(0);
  const [pageSize3, setPageSize3] = React.useState(5);
  const [point3, setPoint3] = React.useState(initialPoint);

  const [chatPicked90, setChatPicked90] = React.useState(true);
  const [smilePicked90, setSmilePicked90] = React.useState(true);
  const [categoryPicked90, setCategoryPicked90] = React.useState(true);

  // 상위 10% 편집점 데이터
  const chatHightlight90 = highlightData.chat_points_90.map((atPoint: any) => ({
    ...highlightData.chat_points[atPoint],
  }));
  const smileHightlight90 = highlightData.smile_points_90.map((atPoint: any) => ({
    ...highlightData.smile_points[atPoint],
  }));

  function selectCategory90(selected: string): any {
    const categoryHightlight90 = highlightData[`${selected}_points_90`].map((atPoint: any) => ({
      ...highlightData[`${selected}_points`][atPoint],
    }));
    return categoryHightlight90;
  }

  const [selectedCategory, setSelectedCategory] = React.useState<CategoryGetRequest>(categories[0]);

  const handleCategorySelect = (clickedCategory: CategoryGetRequest) => {
    setSelectedCategory(clickedCategory);
    setPoint3(initialPoint);
  };

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
              pointNumber={chatPicked90 ? highlightData.chat_points_90.length : highlightData.chat_points.length}
            />
            <Grid container direction="column" justify="center">
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Typography className={classes.timeDescription} variant="body1">
                  {' '}
                  <PriorityHigh className={classes.mark} />
                  그래프 시간은 방송 플레이 타임 기준입니다
                </Typography>
                <ScorePicker picked90={chatPicked90} setPicked90={setChatPicked90} />
              </Grid>
              <Grid item md={12}>
                <Chart
                  data={chatPicked90 ? chatHightlight90 : highlightData.chat_points}
                  chartType="chat"
                  highlight={point}
                  handleClick={setPoint}
                  handlePage={setPage}
                  pageSize={pageSize}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={chatPicked90 ? chatHightlight90 : highlightData.chat_points}
                  handleClick={setPoint}
                  row={point}
                  page={page}
                  pageSize={pageSize}
                  handlePage={setPage}
                  handlePageSize={setPageSize}
                  type="채팅 기반 편집점"
                />
                <div className={classes.buttonWraper}>
                  <HighlightExport
                    selectedStream={selectedStream}
                    exportCategory="chat"
                  />
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
              pointNumber={smilePicked90 ? highlightData.smile_points_90.length : highlightData.smile_points.length}
            />
            <Grid container direction="column" justify="center">
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Typography className={classes.timeDescription} variant="body1">
                  {' '}
                  <PriorityHigh className={classes.mark} />
                  그래프 시간은 방송 플레이 타임 기준입니다
                </Typography>
                <ScorePicker picked90={chatPicked90} setPicked90={setChatPicked90} />
              </Grid>
              <Grid item md={12}>
                <Chart
                  data={smilePicked90 ? smileHightlight90 : highlightData.smile_points}
                  chartType="smile"
                  highlight={point2}
                  handleClick={setPoint2}
                  handlePage={setPage2}
                  pageSize={pageSize2}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={smilePicked90 ? smileHightlight90 : highlightData.smile_points}
                  handleClick={setPoint2}
                  row={point2}
                  page={page2}
                  pageSize={pageSize2}
                  handlePage={setPage2}
                  handlePageSize={setPageSize2}
                  type="웃음 발생 수 기반 편집점"
                />
                <div className={classes.buttonWraper}>
                  <HighlightExport
                    selectedStream={selectedStream}
                    exportCategory="smile"
                  />
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
          <Typography className={classes.heading}>카테고리 기반 편집점</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.wraper}>
          <Grid item md={12}>
            <MetricTitle
              subTitle="카테고리 편집점"
              iconSrc="/images/analyticsPage/logo_search.svg"
              pointNumber={
                categoryPicked90
                  ? highlightData[`${selectedCategory.category}_points_90`].length
                  : highlightData[`${selectedCategory.category}_points`].length
}
            />
            <div style={{
              display: 'inline-flex', flexDirection: 'row', alignItems: 'center', height: 80,
            }}
            >
              {categories.map((category) => (
                <Button
                  className={
                    category.categoryId === selectedCategory.categoryId
                      ? classes.selectedCategoryButton : classes.categoryButton
                  }
                  variant="contained"
                  style={{ width: 150, marginLeft: 16, height: 60 }}
                  onClick={() => handleCategorySelect(category)}
                  key={shortid.generate()}
                >
                  <Typography
                    className={category.categoryId === selectedCategory.categoryId
                      ? classes.selectedButtonTitle : undefined}
                  >
                    {category.categoryName}
                  </Typography>
                </Button>
              ))}
            </div>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Typography className={classes.timeDescription} variant="body1">
                {' '}
                <PriorityHigh className={classes.mark} />
                그래프 시간은 방송 플레이 타임 기준입니다
              </Typography>
              <ScorePicker picked90={chatPicked90} setPicked90={setChatPicked90} />
            </Grid>
            <Grid container direction="column" justify="center">
              <Grid item md={12}>
                <Chart
                  data={categoryPicked90
                    ? selectCategory90(selectedCategory.category)
                    : highlightData[`${selectedCategory.category}_points`]}
                  chartType={selectedCategory.category as MetricsType}
                  highlight={point3}
                  handleClick={setPoint3}
                  handlePage={setPage3}
                  pageSize={pageSize3}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={categoryPicked90
                    ? selectCategory90(selectedCategory.category)
                    : highlightData[`${selectedCategory.category}_points`]}
                  handleClick={setPoint3}
                  row={point3}
                  page={page3}
                  pageSize={pageSize3}
                  handlePage={setPage3}
                  handlePageSize={setPageSize3}
                  type="카테고리 기반 편집점"
                />
                <div className={classes.buttonWraper}>
                  <HighlightExport
                    selectedStream={selectedStream}
                    exportCategory={selectedCategory.category}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

    </Paper>
  );
}
