import React from 'react';
import moment from 'moment';
// material-ui core components
import {
  Typography, List, ListItem, IconButton, ListItemIcon,
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
import { StreamListProps, DayStreamsInfo } from './PeriodAnalysisSection.interface';

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
    '&:hover,select': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  selectedListItem: {

  },
  listItemText: {
    fontFamily: 'SourceSansPro',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 500,
  },
  closeIcon: {
    marginLeft: '30px',
    '&:hover,select': {
      color: 'red',
    },
  },
}));

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    termStreamsList, handleRemoveIconButton,
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

  return (
    <List className={classes.listWrapper}>
      {termStreamsList && termStreamsList.map((stream) => (
        <ListItem
          key={stream.streamId}
          button
          className={classes.listItem}
        >
          <ListItemIcon>
            {platformIcon(stream)}
          </ListItemIcon>

          <Typography className={classes.listItemText}>
            {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
          </Typography>
          <IconButton
            className={classes.closeIcon}
            onClick={() => handleRemoveIconButton(stream)}
          >
            <ClearOutlinedIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}
