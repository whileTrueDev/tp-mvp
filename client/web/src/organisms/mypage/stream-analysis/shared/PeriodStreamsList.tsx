import React from 'react';
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
// atom svg icons
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import YoutubeIcon from '../../../../atoms/stream-analysis-icons/YoutubeIcon';
import TwitchIcon from '../../../../atoms/stream-analysis-icons/TwitchIcon';
import AfreecaIcon from '../../../../atoms/stream-analysis-icons/AfreecaIcon';
// interfaces
import { PeriodStreamsListProps, StreamsListItem } from './StreamAnalysisShared.interface';
import dateExpression, { dayjsFormatter } from '../../../../utils/dateExpression';

const useStyles = makeStyles((theme: Theme) => ({
  listWrapper: {
    width: '100%',
    padding: 0,
    overflow: 'auto',
    height: 'inherit',
  },
  listItemContainer: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(1),
    width: '100%',
    height: 50,
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(0),
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

  },
  listItemText: {

    color: theme.palette.text.secondary,
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 550,
    marginRight: theme.spacing(4),
  },
  removedListItemText: {

    color: theme.palette.text.secondary,
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 550,
    marginRight: theme.spacing(4),
  },
  closeIcon: {
    '&:hover,select': {
      // color: 'red',
      color: theme.palette.error.main,
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
    display: 'inline-flex',
    marginRight: theme.spacing(1),
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

  /**
   * 방송 정보에 따른 플랫폼 아이콘 렌더링 함수
   * @param stream 방송 리스트 아이템 -> 방송 정보 포함중
   */
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

  /**
   * 리스트 아이템 툴팁 컴포넌트 렌더링 함수
   * @param stream 방송 리스트 아이템 -> 방송 정보 포함중
   */
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

  const listItem = (stream: StreamsListItem, removed: boolean) => (

    <ListItem
      key={stream.streamId + stream.platform}
      button
      className={classnames({
        [classes.listItem]: !removed,
        [classes.removedListItem]: removed,
      })}
    >

      {removed ? (
        /* 지워진 방송 아이템 */
        <div className={classes.listItemContainer}>
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={() => handleStreamList(stream, false)}
            color="primary"
          >
            재등록
          </Button>

          <StyledToolTip
            placement="top"
            title={tooltipContents(stream)}
            classes={{ tooltip: classes.noMaxWidth }}
          >
            <div className={classes.listItemContainer}>
              <Typography className={classes.listItemText}>
                {/* 날짜 표현 컴포넌트로 변경 */}

                {dateExpression({
                  createdAt: stream.startDate,
                  compoName: 'analysys-calender',
                  finishAt: stream.endDate,
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

          </StyledToolTip>
        </div>
      ) : (
        /* 지워지지 않은 방송 아이템 */
        <div className={classes.listItemContainer}>
          <IconButton
            className={classes.closeIcon}
            onClick={() => handleStreamList(stream)}
          >
            <ClearOutlinedIcon />
          </IconButton>

          <ListItemIcon>
            {platformIcon(stream)}
          </ListItemIcon>

          <StyledToolTip
            placement="top"
            title={tooltipContents(stream)}
            classes={{ tooltip: classes.noMaxWidth }}
          >
            <div className={classes.listItemContainer}>
              <Typography className={classes.removedListItemText}>
                {dateExpression({
                  createdAt: stream.startDate,
                  compoName: 'analysys-calender',
                  finishAt: stream.endDate,

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

          </StyledToolTip>
        </div>
      )}

    </ListItem>

  );

  return (
    <List className={classes.listWrapper}>
      {selectedDate && selectedStreams.length > 0
        && selectedStreams
          .filter((stream) => dayjsFormatter(stream.startDate, 'date-only') === dayjsFormatter(selectedDate, 'date-only'))
          .map((stream) => listItem(stream, stream.isRemoved))}
      {!selectedDate && selectedStreams.length > 0 && selectedStreams
        .map((stream) => listItem(stream, stream.isRemoved))}
    </List>
  );
}
