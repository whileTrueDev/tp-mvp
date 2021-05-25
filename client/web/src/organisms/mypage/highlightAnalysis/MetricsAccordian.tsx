import React, { useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid, Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import { CategoryGetRequest } from '@truepoint/shared/dist/dto/category/categoryGet.dto';
import shortid from 'shortid';
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
import { List } from 'immutable';
import MetricTitle from '../../shared/sub/MetricTitle';
import MetricsTable from '../../shared/sub/MetricsTable';
import HighlightExport from '../../shared/sub/HighlightExport';
import Highcharts from './HighChart';
import { initialPoint } from './TruepointHighlight';
import ScorePicker from './ScorePicker';

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
  timeDescriptionHighlight: {
    color: theme.palette.warning.main,
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
type MetricsType = 'chat'|'funny'|'agree'|'surprise'|'disgust'|'question'

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
  const [chatPicked97, setChatPicked97] = React.useState(true);
  const [smilePicked97, setSmilePicked97] = React.useState(true);
  const [categoryPicked97, setCategoryPicked97] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);

  const chatHightlight97 = useMemo(() => highlightData.chat_points_97.map((atPoint: number) => ({
    ...highlightData.chat_points[atPoint],
  })), [highlightData]);

  const smileHightlight97 = useMemo(() => highlightData.funny_points_97.map((atPoint: number) => ({
    ...highlightData.funny_points[atPoint],
  }
  )), [highlightData]);

  const selectCategory97 = useCallback((selected: string) => {
    const categoryHightlight97 = highlightData[`${selected}_points_97`].map((atPoint: number, index: number) => ({
      ...highlightData[`${selected}_points`][atPoint], tableData: { id: index },
    }));
    return categoryHightlight97;
  }, [highlightData]);

  const handleCategorySelect = (clickedCategory: CategoryGetRequest) => {
    setPoint3(initialPoint);
    setPage3(0);
    setPageSize3(5);
    setSelectedCategory(clickedCategory);
  };

  const categoryTotalData = useMemo(() => List(highlightData[`${selectedCategory.category}_total_data`]).toJS(), [selectedCategory.category, highlightData]);

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
              pointNumber={chatPicked97 ? highlightData.chat_points_97.length : highlightData.chat_points.length}
            />
            <Grid container direction="column" justify="center">
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Typography className={classes.timeDescription} variant="body1">
                  {' '}
                  ※ 그래프 시간은
                  {' '}
                  <span className={classes.timeDescriptionHighlight}>
                    방송 플레이 타임 기준
                  </span>
                  입니다
                </Typography>
                <ScorePicker
                  picked97={chatPicked97}
                  setPicked97={setChatPicked97}
                  setPage={setPage}
                  setPageSize={setPageSize}
                  setPoint={setPoint}
                />
              </Grid>
              <Grid item md={12}>
                <Highcharts
                  data={chatPicked97 ? chatHightlight97 : highlightData.chat_points}
                  totalData={highlightData.chat_total_data}
                  dataOption={{
                    boundary: chatPicked97 ? highlightData.boundary_97.count : highlightData.boundary.count,
                  }}
                  chartType="chat"
                  highlight={point}
                  handleClick={setPoint}
                  handlePage={setPage}
                  pageSize={pageSize}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={chatPicked97 ? chatHightlight97 : highlightData.chat_points}
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
              pointNumber={smilePicked97 ? highlightData.funny_points_97.length : highlightData.funny_points.length}
            />
            <Grid container direction="column" justify="center">
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Typography className={classes.timeDescription} variant="body1">
                  {' '}
                  ※ 그래프 시간은
                  {' '}
                  <span className={classes.timeDescriptionHighlight}>
                    방송 플레이 타임 기준
                  </span>
                  입니다
                </Typography>
                <ScorePicker
                  picked97={smilePicked97}
                  setPicked97={setSmilePicked97}
                  setPage2={setPage2}
                  setPageSize2={setPageSize2}
                  setPoint2={setPoint2}
                />
              </Grid>
              <Grid item md={12}>
                <Highcharts
                  data={smilePicked97 ? smileHightlight97 : highlightData.highlight_points}
                  totalData={highlightData.highlight_total_data}
                  dataOption={{
                    boundary: smilePicked97 ? highlightData.boundary_97.funny_sum : highlightData.boundary.funny_sum,
                  }}
                  chartType="funny"
                  highlight={point2}
                  handleClick={setPoint2}
                  handlePage={setPage2}
                  pageSize={pageSize2}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={smilePicked97 ? smileHightlight97 : highlightData.funny_points}
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
                    exportCategory="funny"
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
                categoryPicked97
                  ? highlightData[`${selectedCategory.category}_points_97`].length
                  : highlightData[`${selectedCategory.category}_points`].length
              }
            />
            <div style={{
              display: 'inline-flex', flexDirection: 'row', alignItems: 'center', height: 80,
            }}
            >
              {categories.map((category) => (
                (highlightData.boundary[`${category.category}_sum`] !== 0) && (
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
                )
              ))}
            </div>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Typography className={classes.timeDescription} variant="body1">
                {' '}
                ※ 그래프 시간은
                {' '}
                <span className={classes.timeDescriptionHighlight}>
                  방송 플레이 타임 기준
                </span>
                입니다
              </Typography>
              <ScorePicker
                picked97={categoryPicked97}
                setPicked97={setCategoryPicked97}
                setPage3={setPage3}
                setPageSize3={setPageSize3}
                setPoint3={setPoint3}
              />
            </Grid>
            <Grid container direction="column" justify="center">
              <Grid item md={12}>
                <Highcharts
                  data={categoryPicked97
                    ? selectCategory97(selectedCategory.category)
                    : highlightData[`${selectedCategory.category}_points`]}
                  totalData={categoryTotalData}
                  dataOption={{
                    boundary: categoryPicked97
                      ? highlightData.boundary_97[`${selectedCategory.category}_sum`]
                      : highlightData.boundary[`${selectedCategory.category}_sum`],
                  }}
                  chartType={selectedCategory.category as MetricsType}
                  highlight={point3}
                  handleClick={setPoint3}
                  handlePage={setPage3}
                  pageSize={pageSize3}
                />
              </Grid>

              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={categoryPicked97
                    ? selectCategory97(selectedCategory.category)
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
