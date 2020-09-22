import React from 'react';
import {
  Grid, Typography, Card, CardContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import shortid from 'shortid';
import classnames from 'classnames';
import StackedGraph from '../graph/StackedGraph';
import { metricInterface } from '../graph/graphsInterface';

const useStyles = makeStyles(() => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  head: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#575757'
  },
  icon: {
    width: '50.5px',
    height: '50.5px',
    // fontSize: '50px',
    color: '#d9dbe6'
  },
  card: {
    width: '100%',
    height: '94px',
    borderRadius: '4px',
    backgroundColor: '#959abb',
    borderColor: '#fff',
    borderWidth: 0
  },
  main: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#4d4f5c'
  },
  bold: {
    fontWeight: 'bold'
  }
}));

interface StreamAnalysisPropInterface {
  open: boolean;
  metricData: metricInterface[];
}

export default function StreamAnalysis(
  { open, metricData }: StreamAnalysisPropInterface
): JSX.Element {
  const classes = useStyles();

  const iconArray: any[] = [
    <PermIdentityIcon className={classes.icon} key="viewer" />,
    <InsertEmoticonIcon className={classes.icon} key="smile" />,
    <QuestionAnswerIcon className={classes.icon} key="chat" />
  ];

  return (
    <Grid container direction="column" spacing={10}>
      {/* {!open && metricData && (
        <Grid item className={classes.center}>
          <CircularProgress />
        </Grid>
      )}  => 로딩도 멈추는 현상 */}
      {open
       && (metricData.map((element, index) => (
         <Grid item container direction="row" key={shortid.generate()}>
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
                           1번 방송이 2번 방송보다
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
                           1번 방송
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
                           2번 방송
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
