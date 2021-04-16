import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  section: {
    borderTop: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderBottom: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(5),
  },
  title: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(
      'color', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.short },
    ),
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

const dotPositions = [
  { left: 135, top: 50 },
  { left: 215, top: 125 },
  { left: 250, top: 235 },
  { left: 220, top: 350 },
  { left: 125, top: 445 },
];

const data = [
  {
    marginLeft: 0,
    height: 80,
    title: '인내심 테스트',
    createDate: new Date('2021-04-13'),
    maxViewer: 3534,
    likeCount: 130,
    hateCount: 130,
  },
  {
    title: '괴물과 싸우는 자는',
    marginLeft: 70,
    height: 110,
    createDate: new Date('2021-04-13'),
    maxViewer: 3534,
    likeCount: 130,
    hateCount: 130,
  },
  {
    title: '남탓 알파고',
    createDate: new Date('2021-04-13'),
    maxViewer: 3534,
    likeCount: 130,
    hateCount: 130,
    marginLeft: 110,
    height: 125,
  },
  {
    title: '갱왔습니다',
    createDate: new Date('2021-04-13'),
    maxViewer: 3534,
    likeCount: 130,
    hateCount: 130,
    marginLeft: 80,
    height: 85,
  },
  {
    title: '호주 워킹홀리데이 연습생 썰',
    createDate: new Date('2021-04-13'),
    maxViewer: 3534,
    likeCount: 130,
    hateCount: 130,
    marginLeft: 0,
    height: undefined,
  },
];

export default function RecentStreamList(): React.ReactElement {
  const classes = useStyles();

  return (
    <section className={classes.section} id="broad-list" style={{ minHeight: 600, position: 'relative', paddingTop: 24 }}>
      <img
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          left: -230,
        }}
        src="/images/rankingPage/broadPage/twitch_logo_bg.png"
        srcSet="images/rankingPage/broadPage/twitch_logo_bg2x.png 2x"
        alt=""
        draggable={false}
      />
      <img
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          left: -110,
          top: 124,
        }}
        src="/images/rankingPage/broadPage/twitch_logo_blur.png"
        srcSet="images/rankingPage/broadPage/twitch_logo_blur2x.png 2x"
        alt=""
        draggable={false}
      />
      <img
        style={{
          position: 'absolute',
          width: 520,
          height: 480,
          left: -250,
        }}
        src="/images/rankingPage/broadPage/twitch_logo_ring.png"
        srcSet="images/rankingPage/broadPage/twitch_logo_ring2x.png 2x"
        alt=""
        draggable={false}
      />
      {dotPositions.map((dot) => (
        <img
          key={dot.left}
          style={{
            position: 'absolute',
            left: dot.left,
            top: dot.top,
          }}
          src="/images/rankingPage/broadPage/twitch_logo_circle.png"
          srcSet="images/rankingPage/broadPage/twitch_logo_circle2x.png 2x"
          alt=""
          draggable={false}
        />
      ))}
      <div style={{ display: 'box', marginLeft: 200, marginTop: 24 }}>
        {data.map((stream) => (
          <div style={{ marginLeft: stream.marginLeft, height: stream.height }}>
            <Typography to={window.location.pathname} component={Link} variant="h5" className={classes.title}>
              {stream.title}
              <Typography variant="body1" component="span" style={{ marginLeft: 16 }}>
                {dayjs(stream.createDate).format('YYYY-MM-DD')}
              </Typography>
              <Typography variant="body1" component="span" style={{ marginLeft: 16 }}>
                {`최고 시청자 수 : ${stream.maxViewer} 명`}
              </Typography>
              <Typography variant="body1" component="span" style={{ marginLeft: 16 }}>
                {`좋아요 ${stream.likeCount}`}
              </Typography>
              <Typography variant="body1" component="span" style={{ marginLeft: 16 }}>
                {`싫어요 ${stream.likeCount}`}
              </Typography>
            </Typography>
          </div>
        ))}
      </div>

    </section>
  );
}
