import React from 'react';
import {
  Paper, Typography, Grid, Divider, List, ListItem
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

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
  },
  listItemText: {
    fontFamily: 'SourceSansPro',
    color: '#4d4f5c',
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px'
  }
}));

export interface DayStreamsInfo{
    streamId : string;
    title : string;
    platform: 'afreeca'|'youtube'|'twitch';
    airTime: number;
    startedAt: Date;
}

interface StreamListProps {
    dayStreamsList: (DayStreamsInfo)[];
    selectedStreams?: (DayStreamsInfo)[];
    baseStream: DayStreamsInfo|null;
    compareStream: DayStreamsInfo|null;
    handleSeletedStreams: (newStreams: DayStreamsInfo|null, base?: true | undefined) => void;
}

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    dayStreamsList, selectedStreams, handleSeletedStreams, baseStream, compareStream
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

  const handleListStreamClick = (stream: DayStreamsInfo) => {
    console.log(selectedStreams);
    if (baseStream && compareStream) {
      console.log('full');
    } else if (baseStream && !compareStream) {
      console.log('harf');
      //   const newArray = [baseStream, stream];
      //   handleSeletedStreams(newArray);
      handleSeletedStreams(stream);
    } else if (!baseStream && compareStream) {
      console.log('harf');
      //   const newArray = [stream, compareStream];
      //   handleSeletedStreams(newArray);
      handleSeletedStreams(stream, true);
    } else {
      console.log('empty');
      //   const newArray = new Array<DayStreamsInfo>(2);
      //   newArray[0] = stream;
      handleSeletedStreams(stream, true);
    }
  };

  return (
    <List className={classes.listWrapper}>
      {dayStreamsList && dayStreamsList.map((stream) => (
        <ListItem
          button
          key={stream.streamId}
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
