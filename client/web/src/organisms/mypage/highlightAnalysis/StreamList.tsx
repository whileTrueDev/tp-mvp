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
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';

import shortid from 'shortid';
import dateExpression from '../../../utils/dateExpression';
import SelectVideoIcon from '../../../atoms/stream-analysis-icons/SelectVideoIcon';

const useStyles = makeStyles((theme: Theme) => ({
  listWrapper: {
    width: '100vh',
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
  chipWapper: {
    display: 'inline-flex',
    flexDirection: 'column',
  },
  chip: {
    marginRight: theme.spacing(2),
  },
  tooltip: {
    height: 'auto',
    padding: theme.spacing(1),
    maxWidth: 400,
  },
  tooltipIconWrapper: {
    display: 'inline-flex', marginRight: '8px', paddingTop: '4px', flexDirection: 'row',
  },
  tooltipChipWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
    padding: theme.spacing(0),
    width: '100%',
    justifyContent: 'flex-start',
  },
  bodyTitle: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '17px',
    fontFamily: 'AppleSDGothicNeo',
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(5),
    display: 'flex',
    marginBottom: theme.spacing(4),
  },
  selectIcon: {
    fontSize: '28.5px', marginRight: theme.spacing(3),
  },
}));

export interface StreamListProps {
  dayStreamsList: (StreamDataType)[];
  selectedStream: StreamDataType|null;
  handleSeletedStreams: (newStreams: StreamDataType|null, base?: true | undefined) => void;
  platformIcon: (stream: StreamDataType) => JSX.Element;
}

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
    dayStreamsList, handleSeletedStreams, selectedStream,
    platformIcon,
  } = props;

  const tooltipContents = (stream: StreamDataType): JSX.Element => (
    <div className={classes.tooltip}>
      <Typography variant="h6">
        <div className={classes.tooltipIconWrapper}>
          <Avatar style={{ marginBottom: '8px' }}>
            {platformIcon(stream)}
          </Avatar>
        </div>
        {stream.title}
      </Typography>

      <div className={classes.tooltipChipWrapper}>
        <div className={classes.chipWapper}>
          <Typography variant="caption" style={{ marginBottom: 4, marginLeft: 8 }}>
            시청자수
          </Typography>
          <Chip
            icon={<PersonAddIcon />}
            label={stream.viewer}
            size="medium"
            color="primary"
            className={classes.chip}
          />
        </div>
        <div className={classes.chipWapper}>
          <Typography variant="caption" style={{ marginBottom: 4, marginLeft: 12 }}>
            채팅수
          </Typography>
          <Chip
            icon={<ChatIcon />}
            label={stream.chatCount}
            size="medium"
            color="secondary"
            className={classes.chip}
          />
        </div>
        <div className={classes.chipWapper}>
          <Typography variant="caption" style={{ marginBottom: 4 }}>
            웃음 발생 수
          </Typography>
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
    </div>
  );

  const classes = useStyles();

  const handleListStreamClick = (stream: StreamDataType) => {
    handleSeletedStreams(stream, true);
  };

  const isSelectedListItem = (listStream: StreamDataType): boolean => {
    if (selectedStream) {
      return listStream.streamId === selectedStream.streamId;
    }
    return false;
  };

  return (
    <div>
      <Typography className={classes.bodyTitle}>
        <SelectVideoIcon className={classes.selectIcon} />
        방송 선택
      </Typography>

      <List className={classes.listWrapper}>
        {dayStreamsList && dayStreamsList.map((stream) => (
          <StyledToolTip
            arrow
            placement="top"
            title={tooltipContents(stream)}
            key={shortid.generate()}
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
                  createdAt: new Date(stream.startDate),
                  streamAirtime: stream.airTime,
                })}
              </Typography>
              <Typography className={classes.listItemText} style={{ marginLeft: '24px' }}>
                {stream.title.length > 20 ? `${stream.title.slice(0, 21)} ...` : stream.title}
              </Typography>

            </ListItem>
          </StyledToolTip>
        ))}
      </List>
    </div>

  );
}
