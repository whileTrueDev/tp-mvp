import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion, AccordionSummary,
  AccordionDetails, Typography, Grid, ListItem, Button,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import { CategoryGetRequest } from '@truepoint/shared/dist/dto/category/categoryGet.dto';
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
  selectedCategoryButton: {
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.action.selected,
  },
  categoryButton: {
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'scale(1.04)',
      boxShadow: theme.shadows[5],
    },
  },
  selectedButtonTitle: { fontWeight: 'bold' },
}));

interface MetricsAccordianProps {
  metricsData: any;
  analysisWord?: string;
  categories: CategoryGetRequest[];
}

export default function MetricsAccordian(
  {
    metricsData,
    analysisWord,
    categories,
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

  console.log(metricsData);

  const [selectedCategory, setSelectedCategory] = React.useState<CategoryGetRequest>(categories[0]);

  const handleCategorySelect = (clickedCategory: CategoryGetRequest) => {
    setSelectedCategory(clickedCategory);
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
              pointNumber={metricsData.smile_points.length}
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
                >
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    className={category.categoryId === selectedCategory.categoryId
                      ? classes.selectedButtonTitle : undefined}
                  >
                    {category.categoryName}
                  </Typography>
                </Button>
              ))}
            </div>
            <Grid container direction="column" justify="center">
              <Grid item md={12}>
                <Chart
                  data={metricsData[`${selectedCategory.category}_points`]}
                  chartType={selectedCategory.category}
                  highlight={point3}
                  handleClick={setPoint3}
                  handlePage={setPage3}
                  pageSize={pageSize3}
                />
              </Grid>
              <Grid item md={12} className={classes.contentRight}>
                <MetricsTable
                  metrics={metricsData[`${selectedCategory.category}_points`]}
                  handleClick={setPoint3}
                  row={point3}
                  page={page3}
                  pageSize={pageSize3}
                  handlePage={setPage3}
                  handlePageSize={setPageSize3}
                  type="카테고리 기반 편집점"
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

    </Paper>
  );
}
