import React from 'react';
// material-ui core components
import moment from 'moment';
import classnames from 'classnames';
import {
  Card, CardContent, Typography, Grid, IconButton
} from '@material-ui/core';
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
// interface
import { StreamCardProps } from './StreamCompareHero.interface';

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
    minHeight: '130px',
    paddingTop: '11px',
    paddingBottom: '11px',
  },
  cardBodyCompWrapper: {
    width: '100%',
    backgroundColor: '#a6c1f9',
    minHeight: '130px',
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
    marginTop: '4px',
    alignItems: 'center',
  },
  cardBody: {
    fontSize: '22px',
    marginLeft: '20px',
    fontFamily: 'SourceSansPro',
    color: '#4d4f5c',
    lineHeight: '1.5',
    overflow: 'auto',
    width: '100%',
    marginBottom: '10px'
  },
}));

export default function StreamCard(props: StreamCardProps): JSX.Element {
  const {
    stream, base, handleSeletedStreams, platformIcon
  } = props;
  const classes = useStyles();

  const airTimeFormmater = (startDate: Date, streamLength: number) => {
    const endAt = new Date(startDate);
    endAt.setHours(startDate.getHours() + streamLength);
    const airTimeText = `${startDate.getDate()}일
                        ${moment(startDate).format('HH:mm')}~ 
                        ${endAt.getDate()}일
                        ${moment(endAt).format('HH:mm')}`;
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
          direction="row"
          justify="space-between"
        >

          <Grid item>
            <Typography variant="body1" className={classes.cardTitle}>
              {platformIcon(stream)}
              {base ? '기준 방송' : '비교 방송'}
            </Typography>
          </Grid>

          <IconButton
            onClick={handleCloseButton}
          >
            <ClearOutlinedIcon />
          </IconButton>

        </Grid>
        <Grid
          container
          alignContent="center"

          className={classnames({
            [classes.cardBodyWrapper]: base,
            [classes.cardBodyCompWrapper]: !base
          })}
        >

          <Typography className={classes.cardBody} display="block">
            {stream.title}
          </Typography>

          <Typography className={classes.cardBody}>
            {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
          </Typography>

        </Grid>
      </CardContent>
    </Card>
  );
}
