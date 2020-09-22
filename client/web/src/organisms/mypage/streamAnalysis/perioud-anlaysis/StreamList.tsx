import React from 'react';
// material - ui core components
import {
  Typography, List, ListItem, IconButton
} from '@material-ui/core';
// material - ui styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// interface
import { Stream } from 'stream';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import moment from 'moment';
import { StreamListProps, DayStreamsInfo } from './PerioudAnalysisHero.interface';

const useStyles = makeStyles((theme: Theme) => ({
  listWrapper: {
    width: '100%',
    padding: '0px',
    maxHeight: '292px',
    overflow: 'auto'
  },
  listItem: {
    width: '100%',
    height: '50px',
    backgroundColor: '#ffff',
    paddingLeft: '29.1px',
    paddingTop: '13.1px',
    paddingBottom: '13.9x',
    borderRadius: '4px',
    '&:hover,select': {
      backgroundColor: theme.palette.primary.light,
    },
    justifyContent: 'space-between'
  },
  selectedListItem: {

  },
  listItemText: {
    fontFamily: 'SourceSansPro',
    color: '#4d4f5c',
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 500
  }
}));

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    termStreamsList, handleRemoveIconButton
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

  return (
    <List className={classes.listWrapper}>
      {termStreamsList && termStreamsList.map((stream) => (
        <ListItem
          key={stream.streamId}
          button
          className={classes.listItem}
        >
          <Typography className={classes.listItemText}>
            {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
          </Typography>
          <IconButton onClick={() => handleRemoveIconButton(stream)}>
            <ClearOutlinedIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}
