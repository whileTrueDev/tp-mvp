import React from 'react';
// material - ui core components
import {
  Typography, List, ListItem,
} from '@material-ui/core';
// material - ui styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// interface
import { Stream } from 'stream';
import { StreamListProps, DayStreamsInfo } from './StreamAnalysisHero.interface';

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
    }
  },
  selectedListItem: {

  },
  listItemText: {
    fontFamily: 'SourceSansPro',
    color: '#4d4f5c',
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 'bold'
  }
}));

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    dayStreamsList, handleSeletedStreams, baseStream, compareStream,
    handleFullMessage
  } = props;
  const classes = useStyles();

  const airTimeFormmater = (startDate: Date, streamLength: number) => {
    const endAt = new Date(startDate);
    endAt.setHours(startDate.getHours() + streamLength);
    const airTimeText = `${startDate.getDate()}일
                             ${startDate.getHours()}시 ${startDate.getMinutes()}분~ 
                             ${startDate.getDate()}일
                             ${endAt.getHours()}시 ${endAt.getMinutes()}분`;
    return airTimeText;
  };

  const handleListStreamClick = (stream: DayStreamsInfo) => {
    if (baseStream && compareStream) {
      handleFullMessage(true);
    } else if (baseStream && !compareStream) {
      handleSeletedStreams(stream);
    } else if (!baseStream && compareStream) {
      handleSeletedStreams(stream, true);
    } else {
      handleSeletedStreams(stream, true);
    }
  };

  const isSelectedListItem = (listStream: DayStreamsInfo):boolean => {
    console.log((listStream.streamId === baseStream?.streamId
      || listStream.streamId === compareStream?.streamId));

    return (listStream.streamId === baseStream?.streamId
    || listStream.streamId === compareStream?.streamId);
  };

  return (
    <List className={classes.listWrapper}>
      {dayStreamsList && dayStreamsList.map((stream) => (
        <ListItem
          key={stream.streamId}
          button
          selected={isSelectedListItem(stream)}
          className={classes.listItem}
          onClick={() => handleListStreamClick(stream)}
        >
          <Typography className={classes.listItemText}>
            {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}
