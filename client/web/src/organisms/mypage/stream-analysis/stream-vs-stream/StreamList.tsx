import React from 'react';
// material - ui core components
import {
  Typography, List, ListItem, ListItemIcon,
} from '@material-ui/core';
// material - ui styles
import { makeStyles, Theme } from '@material-ui/core/styles';
// shared interface
import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
// interface
import { StreamListProps } from './StreamCompareSectioninterface';
import dateExpression from '../../../../utils/dateExpression';

const useStyles = makeStyles((theme: Theme) => ({
  listWrapper: {
    width: '100%',
    padding: '0px',
    maxHeight: '292px',
    overflow: 'auto',
  },
  listItem: {
    width: '100%',
    height: '50px',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: '29.1px',
    paddingTop: '13.1px',
    paddingBottom: '13.9x',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  selectedListItem: {
    backgroundColor: theme.palette.primary.light,
  },
  listItemText: {
    fontFamily: 'AppleSDGothicNeo',
    color: theme.palette.text.primary,
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 500,
  },
}));

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    dayStreamsList, handleSeletedStreams, baseStream, compareStream,
    handleFullMessage, platformIcon,
  } = props;

  const classes = useStyles();
  /*
    위치를 MakedateForm.tsx로 옮겼습니다. 
 */
  // const airTimeFormmater = (startDate: Date, streamLength: number) => {
  //   const endAt = new Date(startDate);
  //   endAt.setHours(startDate.getHours() + streamLength);
  //   const airTimeText = `${startDate.getDate()}일
  //                        ${moment(startDate).format('HH:mm')}~ 
  //                        ${endAt.getDate()}일
  //                        ${moment(endAt).format('HH:mm')}`;
  //   return airTimeText;
  // };

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

  const isSelectedListItem = (listStream: DayStreamsInfo): boolean => {
    if (baseStream || compareStream) {
      return (listStream.streamId === baseStream?.streamId
    || listStream.streamId === compareStream?.streamId);
    }

    return false;
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
          <ListItemIcon>
            {platformIcon(stream)}
          </ListItemIcon>
          <Typography className={classes.listItemText}>
            {dateExpression({
              compoName: 'calendar',
              createdAt: new Date(stream.startedAt),
              streamAirtime: stream.airTime,
            })}
          </Typography>

        </ListItem>

      ))}
    </List>
  );
}
