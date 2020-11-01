import React from 'react';
import moment from 'moment';
// material-ui core components
import {
  Typography, List, ListItem, IconButton, ListItemIcon, Button,
} from '@material-ui/core';
//  styles
import { makeStyles, Theme } from '@material-ui/core/styles';
// material-ui icons
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
// date library
// atom svg icons
import YoutubeIcon from '../../../../atoms/stream-analysis-icons/YoutubeIcon';
import TwitchIcon from '../../../../atoms/stream-analysis-icons/TwitchIcon';
import AfreecaIcon from '../../../../atoms/stream-analysis-icons/AfreecaIcon';
// interface
import { DayStreamsInfo, StreamsListItem } from './PeriodAnalysisSection.interface';

const useStyles = makeStyles((theme: Theme) => ({
  listWrapper: {
    width: '100%',
    padding: '0px',
    maxHeight: '200px',
    overflow: 'auto',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: '3px',
    width: '100%',
    height: 'auto',
    backgroundColor: theme.palette.primary.light,
    // paddingLeft: '29.1px',
    // paddingTop: '13.1px',
    // paddingBottom: '13.9x',
    // padding: 0,
    padding: '0px',
    borderRadius: '4px',
    '&:hover,select': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  removedListItem: {
    marginTop: '3px',
    width: '100%',
    height: '48px',
    backgroundColor: theme.palette.background.paper,
    // paddingLeft: '29.1px',
    // paddingTop: '13.1px',
    // paddingBottom: '13.9x',
    padding: '0px',
    borderRadius: '4px',
    '&:hover,select': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  selectedListItem: {
    fontFamily: 'AppleSDGothicNeo',
  },
  listItemText: {
    fontFamily: 'AppleSDGothicNeo',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 550,
    marginRight: theme.spacing(4),
  },
  removedListItemText: {
    fontFamily: 'AppleSDGothicNeo',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 550,
    marginRight: theme.spacing(4),
  },
  closeIcon: {
    // marginLeft: '30px',
    '&:hover,select': {
      color: 'red',
    },
  },
  addButton: {
    backgroundColor: '#3a86ff',
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(2),
    '&:hover,select': {
      color: theme.palette.primary.dark,
    },
  },
}));

interface PeriodStreamsListProps {
  selectedStreams: (StreamsListItem)[];
  handleRemoveIconButton: (targetItem: StreamsListItem, isRemoved?: boolean | undefined) => void
  selectedDate?: Date;
}

export default function PeriodStreamsList(props: PeriodStreamsListProps): JSX.Element {
  const {
    selectedStreams, handleRemoveIconButton, selectedDate,
  } = props;
  const classes = useStyles();

  const airTimeFormmater = (startDate: Date, streamLength: number) => {
    const endAt = new Date(startDate);
    endAt.setHours(startDate.getHours() + streamLength);
    const airTimeText = `${startDate.getDate()}일
                         ${moment(startDate).format('HH:mm')} ~
                         ${endAt.getDate()}일
                         ${moment(endAt).format('HH:mm')}`;

    return airTimeText;
  };

  const platformIcon = (stream: DayStreamsInfo): JSX.Element => {
    switch (stream.platform) {
      case 'afreeca':
        return (
          <AfreecaIcon />
        );
      case 'twitch':
        return (
          <TwitchIcon />
        );
      case 'youtube':
        return (
          <YoutubeIcon />
        );
      default:
        return <div />;
    }
  };

  const listItems = (stream: StreamsListItem): JSX.Element => (
    <ListItem
      key={stream.streamId}
      button
      className={classes.listItem}
    >
      <IconButton
        className={classes.closeIcon}
        onClick={() => handleRemoveIconButton(stream)}
      >
        <ClearOutlinedIcon />
      </IconButton>

      <ListItemIcon>
        {platformIcon(stream)}
      </ListItemIcon>

      <Typography className={classes.listItemText}>
        {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
      </Typography>

      <Typography className={classes.listItemText}>
        {stream.title}
      </Typography>

    </ListItem>
  );

  const removedListItems = (stream: StreamsListItem): JSX.Element => (
    <ListItem
      key={stream.streamId}
      button
      className={classes.removedListItem}
    >
      <Button
        variant="contained"
        className={classes.addButton}
        onClick={() => handleRemoveIconButton(stream, false)}
      >
        재등록
      </Button>

      <Typography className={classes.removedListItemText}>
        {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
      </Typography>

      <Typography className={classes.removedListItemText}>
        {stream.title}
      </Typography>
    </ListItem>
  );

  return (
    <List className={classes.listWrapper}>
      {selectedDate && selectedStreams
        && selectedStreams
          .filter((stream) => moment(stream.startedAt).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'))
          .map((stream) => {
            if (stream.isRemoved) return removedListItems(stream);
            return listItems(stream);
          })}
      {!selectedDate && selectedStreams && selectedStreams.map((stream) => {
        if (stream.isRemoved) return removedListItems(stream);
        return listItems(stream);
      })}
    </List>
  );
}
