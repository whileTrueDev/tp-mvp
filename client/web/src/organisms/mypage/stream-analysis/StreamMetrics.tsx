import React from 'react';
import {
  Grid, Typography, Card, CardContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import classnames from 'classnames';
import StackedGraph from '../graph/StackedGraph';
import { metricInterface } from '../graph/graphsInterface';
import MetricIcons from '../../../atoms/Graph-icons/MetricIcons';
import SectionTitle from '../../shared/sub/SectionTitles';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4) },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  head: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  card: {
    borderRadius: '4px',
    backgroundColor: '#959abb',
    borderWidth: 0,
  },
  main: {
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.text.primary,
  },
  bold: {
    fontWeight: 'bold',
  },
}));

interface StreamAnalysisPropInterface {
  exampleMode?: boolean;
  open: boolean;
  metricData: metricInterface[];
  type?: string;
}

export default function StreamAnalysis(
  {
    open, metricData, type, exampleMode,
  }: StreamAnalysisPropInterface,
): JSX.Element {
  const classes = useStyles();

  const iconArray: any[] = [
    <MetricIcons name="viewer" key="viewer" />,
    <MetricIcons name="smile" key="smile" />,
    <MetricIcons name="chat" key="chat" />,
  ];

  return (
    <Grid container direction="column" spacing={1} className={classes.root}>
      {/* {!open && metricData && (
        <Grid item className={classes.center}>
          <CircularProgress />
        </Grid>
      )}  => 로딩도 멈추는 현상 */}
      {open && (
        <>
          <SectionTitle mainTitle="채팅 발생수 평균 비교" />
          <>
            {metricData.map((element, index) => (
              <Grid item xs={12} container direction="row" key={shortid.generate()} style={{ marginTop: '32px' }}>
                <Grid item xs={2} className={classes.center}>
                  {iconArray[index]}
                  <Typography className={classes.head}>{element.title}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <StackedGraph name={element.title} comeData={element.value} />
                    </Grid>
                    <Grid item>
                      <Card className={classes.card} variant="outlined">
                        <CardContent className={classes.center}>
                          <Grid container direction="row" justify="center">
                            <Grid item>
                              <Typography>
                                {type ? '기준 기간' : <Typography className={classes.main} component="span">{`"${element.broad1Title}" `}</Typography> }
                                이&nbsp;
                                {type ? '비교 기간' : <Typography className={classes.main} component="span">{`"${element.broad2Title}" `}</Typography> }
                                보다&nbsp;
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography gutterBottom className={classes.main}>
                                <Typography component="span" className={classnames(classes.main, classes.bold)}>
                                  {element.title}
                                </Typography>
                                가&nbsp;
                                <Typography component="span" className={classnames(classes.main, classes.bold)}>
                                  {element.diff}
                                  &nbsp;
                                </Typography>
                                {element.sign ? '더 많습니다.' : '더 적습니다.'}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container direction="row" justify="center" spacing={2}>
                            <Grid item>
                              <Typography className={classes.main}>
                                기준
                                {' '}
                                {type ? '기간' : '방송' }
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography className={classnames(classes.main, classes.bold)}>
                                {element.broad1Count}
                                {element.unit}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography className={classes.main}>
                                VS
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography className={classes.main}>
                                비교
                                {' '}
                                {type ? '기간' : '방송' }
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography className={classnames(classes.main, classes.bold)}>
                                {element.broad2Count}
                                {element.unit}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </>
        </>
      )}
    </Grid>
  );
}
