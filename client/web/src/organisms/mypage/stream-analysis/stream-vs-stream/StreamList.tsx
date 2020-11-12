import React from 'react';
// material - ui core components
import {
  Typography, List, ListItem, ListItemIcon,
  Tooltip, Avatar, Chip,
} from '@material-ui/core';
// material - ui styles
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
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
    marginBottom: theme.spacing(1),
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
  noMaxWidth: {
    maxWidth: 'none',
    padding: theme.spacing(2),
  },
  chip: {
    marginRight: theme.spacing(2),
  },
  tooltip: {
    height: 'auto',
    padding: theme.spacing(1),
  },
  tooltipIconWrapper: {
    display: 'inline', marginRight: '8px', paddingTop: '4px',
  },
  tooltipChipWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
    padding: theme.spacing(0),
    width: '100%',
    justifyContent: 'flex-start',
  },
}));

const StyledToolTip = withStyles((theme) => ({
  arrow: {
    fontSize: '22px',
  },
  tooltip: {
    maxWidth: 'none',
    padding: theme.spacing(2),
  },
}))(Tooltip);

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    dayStreamsList, handleSeletedStreams, baseStream, compareStream,
    handleFullMessage, platformIcon,
  } = props;

  const tooltipContents = (stream: DayStreamsInfo): JSX.Element => (
    <div className={classes.tooltip}>
      <Typography variant="h6" style={{ whiteSpace: 'nowrap' }}>
        <div className={classes.tooltipIconWrapper}>
          <Avatar style={{ marginBottom: '8px' }}>
            {platformIcon(stream)}
          </Avatar>
          {stream.title}
        </div>
      </Typography>

      <div className={classes.tooltipChipWrapper}>
        <Chip
          icon={<PersonAddIcon />}
          label={stream.viewer}
          size="medium"
          color="primary"
          className={classes.chip}
        />
        <Chip
          icon={<ChatIcon />}
          label={stream.chatCount}
          size="medium"
          color="secondary"
          className={classes.chip}
        />
        <Chip
          icon={<EmojiEmotionsIcon />}
          label={stream.smileCount}
          size="medium"
          color="primary"
          className={classes.chip}
          style={{
            background: '#d3d19d',
          }}
        />
      </div>
    </div>
  );

  const classes = useStyles();

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
        <StyledToolTip
          arrow
          placement="top"
          title={tooltipContents(stream)}
        >
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
                compoName: 'analysys-calender',
                createdAt: new Date(stream.startedAt),
                streamAirtime: stream.airTime,
              })}
            </Typography>

            <Typography className={classes.listItemText} style={{ marginLeft: '24px' }}>
              {stream.title.length > 15 ? `${stream.title.slice(0, 15)} ...` : stream.title}
            </Typography>

          </ListItem>
        </StyledToolTip>
      ))}
    </List>
  );
}
