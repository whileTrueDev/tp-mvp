import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  wraper: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    height: '100%',
  },
  animatedTitle: {
    fontFamily: 'AppleSDGothicNeo',
    height: '50vmin',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: '50vmin',
    left: '40%',
    top: '50%',
  },
  textTop: {
    height: '50%',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    borderBottom: `5px solid ${theme.palette.primary.main}`,
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textBottom: {
    bottom: 0,
    height: '50%',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    '&>div': {
      animation: '$showBottomText 1s',
      animationDelay: '2.5s',
      animationFillMode: 'forwards',
      top: 0,
      transform: 'translate(0, -100%)',
      fontSize: 50,
      textAlign: 'right',
      fontWeight: 800,
      color: theme.palette.primary.main,
      padding: '2vmin 0',
      position: 'absolute',
    },
  },
  textTopIn: {
    fontSize: '60px',
    padding: '2vmin 0',
    position: 'absolute',
    '&> span': {
      display: 'block',
    },
    textAlign: 'right',
    fontWeight: 800,
    animation: '$showTopText 2s',
    animationDelay: '0.5s',
    animationFillMode: 'forwards',
    bottom: 0,
    transform: 'translate(0, 100%)',
  },
  firstText: {
    color: theme.palette.primary.light,
    fontSize: '50px',
  },
  secondText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 800,
  },
  '@keyframes showTopText': {
    '0%': {
      transform: 'translate3d(0, 100%, 0)',
    },
    '40%': {
      transform: 'translate3d(0, 50%, 0)',
    },
    '60%': {
      transform: 'translate3d(0, 50%, 0)',
    },
    '100%': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  '@keyframes showBottomText': {
    '0%': {
      transform: 'translate3d(0, -100%, 0)',
    },
    '100%': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  wordCarousel: {
    height: 65,
    width: 400,
    left: '61.5%',
    top: '44.5%',
    overflow: 'hidden',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
  },
  carouselWraper: {
    overflow: 'hidden',
    position: 'relative',
    float: 'left',
    height: 65,
    paddingTop: 10,
    marginTop: -10,
    '&>ul>li': {
      fontFamily: 'AppleSDGothicNeo',
      fontSize: 36,
      fontWeight: 800,
      height: 45,
      marginBottom: 45,
      display: 'block',
    },
  },
  flip: {
    animation: '$flip 6s cubic-bezier(0.23, 1, 0.32, 1.2) forwards',
    animationDelay: '4s',
    visibility: 'hidden',
  },
  styledText: {
    color: theme.palette.success.main,
  },
  '@keyframes flip': {
    '0%': { marginTop: -270, visibility: 'visible' },
    '5%': { marginTop: -180, visibility: 'visible' },
    '33%': { marginTop: -180, visibility: 'visible' },
    '38%': { marginTop: -90, visibility: 'visible' },
    '66%': { marginTop: -90, visibility: 'visible' },
    '71%': { marginTop: 0, visibility: 'visible' },
    '99.99%': { marginTop: 0, visibility: 'visible' },
    '100%': { marginTop: -270, visibility: 'visible' },
  },
}));

interface LoadingComponentProps {
  clickOpen: boolean;
  lodingTime: number;
}

export default function LoadingComponent({
  clickOpen,
  lodingTime,
}: LoadingComponentProps): JSX.Element {
  const classes = styles();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (clickOpen) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, lodingTime);
    }
  }, [clickOpen, lodingTime]);

  return (
    <Modal
      open={open}
      closeAfterTransition
      disableBackdropClick
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.wraper}>
          <div className={classes.animatedTitle}>
            <div className={classes.textTop}>
              <div className={classes.textTopIn}>
                <span className={classes.firstText}>방송의 하이라이트</span>
                <svg viewBox="0 0 100 20" className={classes.secondText}>
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#929ef8" />
                      <stop offset="95%" stopColor="#4b5ac7" />
                    </linearGradient>
                    <pattern
                      id="wave"
                      x="0"
                      y="0"
                      width="100"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        id="wavePath"
                        d="M-40 9 Q-30 7 -20 9 T0 9 T20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V20 H-40z"
                        mask="url(#mask)"
                        fill="url(#gradient)"
                      >
                        <animateTransform
                          attributeName="transform"
                          begin="0s"
                          dur="2s"
                          type="translate"
                          from="0,0"
                          to="40,0"
                          repeatCount="indefinite"
                        />
                      </path>
                    </pattern>
                  </defs>
                  <text
                    textAnchor="middle"
                    x="50"
                    y="15"
                    fontSize="17"
                    fill="url(#wave)"
                    fillOpacity="0.9"
                  >
                    TRUEPOINT:

                  </text>
                  <text
                    textAnchor="middle"
                    x="50"
                    y="15"
                    fontSize="17"
                    fill="url(#gradient)"
                    fillOpacity="0.5"
                  >
                    TRUEPOINT:

                  </text>
                </svg>
              </div>
            </div>
            <div className={classes.textBottom}>
              <div>오늘 방송 알찼나?</div>
            </div>
          </div>
          <div className={classes.wordCarousel}>
            <div className={classes.carouselWraper}>
              <ul className={classes.flip}>
                <li className={classes.styledText}>분석완료!</li>
                <li>잠시만요! 끝나가요</li>
                <li className={classes.styledText}>방송 분석중이에요</li>
              </ul>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
