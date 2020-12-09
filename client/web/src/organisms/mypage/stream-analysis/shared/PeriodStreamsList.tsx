import React from 'react';
import moment from 'moment';
// material-ui core components
import {
  Typography, List, ListItem, IconButton, ListItemIcon, Button,
  Tooltip, Chip,
} from '@material-ui/core';
import classnames from 'classnames';
//  styles
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
// material-ui icons
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
// shared dto and interface
// import { DayStreamsInfo } from '@truepoint/shared/dist/interfaces/DayStreamsInfo.interface';
// atom svg icons
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import YoutubeIcon from '../../../../atoms/stream-analysis-icons/YoutubeIcon';
import TwitchIcon from '../../../../atoms/stream-analysis-icons/TwitchIcon';
import AfreecaIcon from '../../../../atoms/stream-analysis-icons/AfreecaIcon';
// interfaces
import { PeriodStreamsListProps, StreamsListItem } from './StreamAnalysisShared.interface';
import dateExpression from '../../../../utils/dateExpression';

const useStyles = makeStyles((theme: Theme) => ({
  listWrapper: {
    width: '100%',
    padding: 0,
    // maxHeight: '250px',
    overflow: 'auto',
    height: 'inherit',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(1),
    width: '100%',
    height: 50,
    backgroundColor: theme.palette.primary.light,
    padding: '0px',
    borderRadius: '4px',
    '&:hover,select': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  removedListItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(1),
    width: '100%',
    height: 50,
    backgroundColor: theme.palette.background.paper,
    padding: '0px',
    borderRadius: '4px',
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
    '&:hover,select': {
      color: 'red',
      transform: 'scale(1.1)',
    },
    fontWeight: 'bold',
    marginRight: 2,
  },
  addButton: {
    backgroundColor: '#3a86ff',
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(1),
    '&:hover,select': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[10],
    },
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
    display: 'inline-flex',
    marginRight: '8px',
    // paddingTop: '8px',
    flexDirection: 'row',
    alignItems: 'flex-end',
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

export default function PeriodStreamsList(props: PeriodStreamsListProps): JSX.Element {
  const {
    selectedStreams, handleStreamList, selectedDate, small,
  } = props;
  const classes = useStyles();

  const platformIcon = (stream: StreamsListItem): JSX.Element => {
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

  const tooltipContents = (stream: StreamsListItem): JSX.Element => (
    <div className={classes.tooltip}>
      <Typography variant="h6">
        <div className={classes.tooltipIconWrapper}>
          {platformIcon(stream)}
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

  const listItem = (stream: StreamsListItem, removed: boolean) => (
    <StyledToolTip
      // arrow
      placement="top"
      title={tooltipContents(stream)}
      classes={{ tooltip: classes.noMaxWidth }}
    >
      <ListItem
        key={stream.streamId + stream.platform}
        button
        className={classnames({
          [classes.listItem]: !removed,
          [classes.removedListItem]: removed,
        })}
      >

        {removed ? (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Button
              variant="contained"
              className={classes.addButton}
              onClick={() => handleStreamList(stream, false)}
              color="primary"
            >
              재등록
            </Button>

            <Typography className={classes.listItemText}>
              {/* 날짜 표현 컴포넌트로 변경 */}

              {dateExpression({
                createdAt: new Date(stream.startedAt),
                compoName: 'analysys-calender',
                streamAirtime: stream.airTime,
              })}
            </Typography>

            {!small && (
            <Typography className={classes.listItemText}>
              {stream.title.length >= 15 ? `${stream.title.slice(0, 15)} ...` : stream.title}
            </Typography>
            )}

            {small && (
            <Typography className={classes.listItemText}>
              {stream.title.length >= 7 ? `${stream.title.slice(0, 8)} ...` : stream.title}
            </Typography>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              className={classes.closeIcon}
              onClick={() => handleStreamList(stream)}
            >
              <ClearOutlinedIcon />
            </IconButton>

            <ListItemIcon>
              {platformIcon(stream)}
            </ListItemIcon>

            <Typography className={classes.removedListItemText}>
              {dateExpression({
                createdAt: new Date(stream.startedAt),
                compoName: 'analysys-calender',
                streamAirtime: stream.airTime,
              })}
            </Typography>

            {/* normal 옵션인 경우 */}
            {!small && (
            <Typography className={classes.listItemText}>
              {stream.title.length >= 15 ? `${stream.title.slice(0, 15)} ...` : stream.title}
            </Typography>
            )}
            {/* small 옵션인 경우 */}
            {small && (
            <Typography className={classes.listItemText}>
              {stream.title.length >= 7 ? `${stream.title.slice(0, 8)} ...` : stream.title}
            </Typography>
            )}
          </div>
        )}

      </ListItem>
    </StyledToolTip>
  );

  return (
    <List className={classes.listWrapper}>
      {selectedDate && selectedStreams.length > 0
        && selectedStreams
          .filter((stream) => moment(stream.startedAt).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'))
          .map((stream) => listItem(stream, stream.isRemoved))}
      {!selectedDate && selectedStreams.length > 0 && selectedStreams
        .map((stream) => listItem(stream, stream.isRemoved))}
    </List>
  );
}
