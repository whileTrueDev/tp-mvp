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

const useStyles = makeStyles((theme) => ({
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
    height: '94px',
    borderRadius: '4px',
    backgroundColor: '#959abb',
    borderWidth: 0,
  },
  main: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: theme.palette.text.primary,
  },
  bold: {
    fontWeight: 'bold',
  },
}));

interface StreamAnalysisPropInterface {
  open: boolean;
  metricData: metricInterface[];
  type?: string;
}

export default function StreamAnalysis(
  { open, metricData, type }: StreamAnalysisPropInterface,
): JSX.Element {
  const classes = useStyles();

  const iconArray: any[] = [
    <MetricIcons name="viewer" key="viewer" />,
    <MetricIcons name="smile" key="smile" />,
    <MetricIcons name="chat" key="chat" />,
  ];

  return (
    <Grid container direction="column" spacing={1}>
      {/* {!open && metricData && (
        <Grid item className={classes.center}>
          <CircularProgress />
        </Grid>
      )}  => 로딩도 멈추는 현상 */}
      {open
       && (metricData.map((element, index) => (
         <Grid item xs={12} container direction="row" key={shortid.generate()}>
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
                     <Grid container direction="row" justify="center" spacing={1}>
                       <Grid item>
                         <Typography className={classes.main}>
                           1번
                           {' '}
                           {type ? '기간' : '방송' }
                           이 2번
                           {' '}
                           {type ? '기간' : '방송' }
                           보다
                           {' '}
                           {element.title}
                           가
                           {' '}
                         </Typography>
                       </Grid>
                       <Grid item>
                         <Typography className={classnames(classes.main, classes.bold)}>
                           {`${Math.abs(element.diff)}%`}
                         </Typography>
                       </Grid>
                       <Grid item>
                         <Typography className={classes.main}>
                           {element.diff > 0 ? '더 낮습니다.' : '더 높습니다.'}
                         </Typography>
                       </Grid>
                     </Grid>
                     <Grid container direction="row" justify="center" spacing={2}>
                       <Grid item>
                         <Typography className={classes.main}>
                           1번
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
                           2번
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
       )))}
    </Grid>
  );
}
