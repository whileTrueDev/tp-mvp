import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
// material-ui core components
import {
  Typography, IconButton, Paper,
} from '@material-ui/core';
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
// icons
import VideocamIcon from '@material-ui/icons/Videocam';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
// interface
import { StreamCardProps } from './StreamCompareSectioninterface';

const useStyles = makeStyles((theme: Theme) => ({
  cardWrapper: {
    padding: theme.spacing(2),
    width: 400,
    height: 200,
    overflow: 'hidden',
  },
  base: { marginRight: theme.spacing(2) },
  compare: { marginLeft: theme.spacing(2) },
  baseIcon: { color: theme.palette.primary.dark },
  compareIcon: { color: theme.palette.secondary.main },
  baseBeforeIcon: { color: theme.palette.primary.light },
  compareBeforeIcon: { color: theme.palette.secondary.light },
  dotted: {
    borderColor: theme.palette.action.selected,
    borderStyle: 'dashed',
    borderRadius: 5,
  },
  titleContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { display: 'flex', alignItems: 'center' },
  titleText: { marginLeft: theme.spacing(2), fontWeight: 'bold' },
  contents: { padding: theme.spacing(2), marginLeft: theme.spacing(4) },
}));

export default function StreamCard(props: StreamCardProps): JSX.Element {
  const {
    stream, base, handleSeletedStreams, platformIcon,
  } = props;
  const classes = useStyles();

  // 방송시간 날짜 Formmater
  const airTimeFormmater = (startDate: Date, streamLength: number) => {
    const endAt = new Date(startDate);
    endAt.setHours(startDate.getHours() + streamLength);
    const airTimeText = `${startDate.getDate()}일
                        ${moment(startDate).format('HH:mm')} ~ 
                        ${endAt.getDate()}일
                        ${moment(endAt).format('HH:mm')}`;
    return airTimeText;
  };

  const handleCloseButton = () => {
    if (base)handleSeletedStreams(null, true);
    else handleSeletedStreams(null);
  };

  // 제목 글자수 제한
  const TITLE_STR_LIMIT = 40;

  return (
    <>
      {!stream ? ( // 방송이 아직 선택되지 않은 경우
        <Paper
          elevation={0}
          className={classnames({
            [classes.cardWrapper]: true, [classes.dotted]: true, [classes.base]: base, [classes.compare]: !base,
          })}
        >
          <div className={classes.titleContainer}>
            <div className={classes.title}>
              <VideocamIcon className={base ? classes.baseBeforeIcon : classes.compareBeforeIcon} fontSize="large" />
              <Typography variant="h6" color="textSecondary" className={classes.titleText}>
                {base ? '기준 방송' : '비교 방송'}
              </Typography>
            </div>
          </div>
          <div className={classes.contents}>
            <Typography variant="h6" color="textSecondary" style={{ textDecoration: 'underline' }}>
              목록에서 방송을 선택하세요.
            </Typography>
          </div>
        </Paper>
      ) : (
        // 방송이 선택된 경우
        <Paper
          className={classnames({
            [classes.cardWrapper]: true, [classes.base]: base, [classes.compare]: !base,
          })}
        >
          {/* 타이틀 */}
          <div className={classes.titleContainer}>
            <div className={classes.title}>
              <VideocamIcon className={base ? classes.baseIcon : classes.compareIcon} fontSize="large" />
              <Typography variant="h6" className={classes.titleText}>
                {base ? '기준 방송' : '비교 방송'}
              </Typography>
            </div>
            <IconButton onClick={handleCloseButton}>
              <ClearOutlinedIcon />
            </IconButton>
          </div>

          {/* 카드 몸체 */}
          <div className={classes.contents}>
            {stream.title.length > TITLE_STR_LIMIT
              ? (
                <Typography variant="h6" color="textSecondary">
                  {`${stream.title.slice(0, TITLE_STR_LIMIT - 3)}...`}
                </Typography>
              ) : (
                <Typography variant="h6" color="textSecondary">
                  {stream.title}
                </Typography>
              )}
            <Typography variant="body1" color="textSecondary">
              {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
              {' '}
              {platformIcon(stream)}
            </Typography>
          </div>
        </Paper>
      )}
    </>
  );
}
