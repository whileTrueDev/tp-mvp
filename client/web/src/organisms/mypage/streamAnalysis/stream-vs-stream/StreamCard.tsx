import React from 'react';
import {
  Card, CardHeader, CardContent, Typography, Grid, Hidden, IconButton
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) => ({
  cardWrapper: {
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '0px',
    borderBottomRightRadius: '12px',
    borderBottomLeftRadius: '12px',
    width: '100%',
    minHeight: '134px',
    boxShadow: 'none'
  },
  cardTitleWrapper: {
    width: '100%',
    backgroundColor: '#b5b5b5',
    height: '46px',
  },
  cardTitleCompWrapper: {
    width: '100%',
    backgroundColor: '#8699c1',
    height: '46px',
  },
  cardBodyWrapper: {
    width: '100%',
    backgroundColor: '#e7ebef',
    minHeight: '89px',
    paddingTop: '11px',
    paddingBottom: '11px',
  },
  cardBodyCompWrapper: {
    width: '100%',
    backgroundColor: '#a6c1f9',
    minHeight: '89px',
    paddingTop: '11px',
    paddingBottom: '11px',
  },
  cardTitle: {
    fontSize: '22px',
    marginLeft: '13px',
    fontWeight: 'bold',
    fontFamily: 'SourceSansPro',
    color: '#4d4f5c',
    lineHeight: '1.5',
    overflow: 'auto',
    display: 'flex',
    marginTop: '4px'
  },
  cardBody: {
    fontSize: '22px',
    marginLeft: '20px',
    fontFamily: 'SourceSansPro',
    color: '#4d4f5c',
    lineHeight: '1.5',
    overflow: 'auto'
  },
}));
export interface DayStreamsInfo{
    streamId : string;
    title : string;
    platform: 'afreeca'|'youtube'|'twitch';
    airTime: number;
    startedAt: Date;
  }

interface StreamCardProps {
    stream: DayStreamsInfo;
    base? : true|null;
    // baseStream: DayStreamsInfo|null;
    // compareStream: DayStreamsInfo|null;
    handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void
}

export default function StreamCard(props: StreamCardProps): JSX.Element {
  const {
    stream, base, handleSeletedStreams,
  } = props;
  const classes = useStyles();

  const airTimeFormmater = (startDate: Date, streamLength: number) => {
    const endAt = new Date(startDate);
    endAt.setHours(startDate.getHours() + streamLength);
    const airTimeText = `${startDate.getDate()}일
                             ${startDate.getHours()}:${startDate.getMinutes()} ~ 
                             ${startDate.getDate()}일
                             ${endAt.getHours()}:${endAt.getMinutes()}`;
    return airTimeText;
  };

  const handleCloseButton = () => {
    if (base) {
      handleSeletedStreams(null, true);
    } else {
      handleSeletedStreams(null);
    }
  };

  return (
    <Card className={classes.cardWrapper}>
      <CardContent style={{ padding: '0px' }}>
        <Grid
          container
          className={classnames({
            [classes.cardTitleWrapper]: base,
            [classes.cardTitleCompWrapper]: !base
          })}
          justify="space-between"
        >
          <Grid item alignContent="center">
            <Typography variant="body1" className={classes.cardTitle}>
              {base ? '기준 방송' : '비교 방송'}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={handleCloseButton}
            >
              <ClearOutlinedIcon />
            </IconButton>
          </Grid>

        </Grid>
        <Grid
          container
          alignContent="center"
          className={classnames({
            [classes.cardBodyWrapper]: base,
            [classes.cardBodyCompWrapper]: !base
          })}
        >
          <Grid item>
            <Typography className={classes.cardBody} display="block">
              {stream.title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.cardBody}>
              {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
