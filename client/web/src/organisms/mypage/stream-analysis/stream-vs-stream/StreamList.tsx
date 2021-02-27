import React from 'react';
// material - ui core components
import {
  Typography, List, ListItem, ListItemIcon,
  Tooltip, Chip,
} from '@material-ui/core';
// material - ui styles
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
// shared interface
import { StreamDataType } from '@truepoint/shared/dist/interfaces/StreamDataType.interface';
// interface
import shortid from 'shortid';
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
    marginRight: theme.spacing(4),
  },
  chipLable: {
    marginBottom: 4, marginLeft: 4,
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
}));

const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    maxWidth: 'none',
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
}))(Tooltip);

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    dayStreamsList, handleSeletedStreams, baseStream, compareStream,
    handleFullMessage, platformIcon,
  } = props;

  const tooltipContents = (stream: StreamDataType): JSX.Element => (
    <div className={classes.tooltip}>
      <Typography variant="h6">
        <div className={classes.tooltipIconWrapper}>
          {platformIcon(stream)}
        </div>
        {stream.title}
      </Typography>

      <div className={classes.tooltipChipWrapper}>
        <div className={classes.chipWapper}>
          <Typography variant="caption" className={classes.chipLable}>
            평균 시청자수
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
          <Typography variant="caption" className={classes.chipLable}>
            평균 채팅수
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
          <Typography variant="caption" className={classes.chipLable}>
            평균 웃음 발생 수
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

  const isSelectedListItem = (listStream: StreamDataType): boolean => {
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
                finishAt: new Date(stream.endDate),

              })}
            </Typography>

            <Typography className={classes.listItemText} style={{ marginLeft: '24px' }}>
              {stream.title.length > 25 ? `${stream.title.slice(0, 25)} ...` : stream.title}
            </Typography>

          </ListItem>
        </StyledToolTip>
      ))}
    </List>
  );
}
