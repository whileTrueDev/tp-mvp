import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Modal, Backdrop, Fade, Typography,
} from '@material-ui/core';

/**
   * clickOpen 프롭을 통해 로딩창 활성화
   * 로딩 컴포넌트 타입은 총 3개
   *  - short: 2초 로고 바운드 효과 로딩컴포넌트(간단한 로딩 필요시)
   *  - medium: 5초 텍스트 캐러셀 효과 로딩컴포넌트(어디에서 쓸지...)
   *  - long: 10초 텍스트 캐러셀 효과 로딩컴포넌트(분석하기 용)
   * 
   *  디폴트는 long 으로 프롭이 없을 시에는 분석하기 버튼용 로딩 컴포넌트가 활성화 됨
  */

const styles = makeStyles((theme) => ({
  wraper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedTitle: {

    height: '400px',
    width: '500px',
  },
  animatedTitleMedium: {

    height: '400px',
    width: '500px',
  },
  textTop: {
    height: '50%',
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottom: `5px solid ${theme.palette.primary.main}`,
  },
  textBottom: {
    bottom: 0,
    height: '50%',
    overflow: 'hidden',
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
    },
  },
  textTopIn: {
    paddingTop: '35px',
    fontSize: '60px',
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
    '40%, 60%': {
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
    height: 500,
    width: 400,
    overflow: 'hidden',
  },
  carouselWraper: {
    overflow: 'hidden',
    position: 'relative',
    top: '33%',
    float: 'left',
    height: 65,
    paddingTop: 10,
    marginTop: -10,
    '&>ul>li': {

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
    color: theme.palette.error.main,
  },
  '@keyframes flip': {
    '0%, 100%': { marginTop: -270, visibility: 'visible' },
    '5%, 33%': { marginTop: -180, visibility: 'visible' },
    '38%, 66%': { marginTop: -90, visibility: 'visible' },
    '71%, 99.99%': { marginTop: 0, visibility: 'visible' },
  },
  loadingShortLogo: {
    animation: '$bound 2s ease-in-out infinite forwards',
  },
  '@keyframes bound': {
    '0%, 60%, 75%, 90%, 100%': { transform: 'translateY(0)' },
    '70%': { transform: 'translateY(-10px)' },
    '80%': { transform: 'translateY(-5px)' },
  },
  shortWraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    height: 400,
  },
}));

interface LoadingComponentProps {
  clickOpen: boolean;
  loadingType?: string;
}

export default function LoadingComponent({
  clickOpen,
  loadingType = 'short',
}: LoadingComponentProps): JSX.Element {
  const classes = styles();
  const [open, setOpen] = React.useState(false);

  let loadingTime = 2000;
  switch (loadingType) {
    case 'long':
      loadingTime = 10000;
      break;
    case 'medium':
      loadingTime = 5000;
      break;
    default:
      break;
  }

  React.useEffect(() => {
    const firstTime = new Date().getTime();
    if (clickOpen) {
      setOpen(true);
      const secondTime = new Date().getTime();
      const betweenTime = secondTime - firstTime;
      setTimeout(() => {
        setOpen(false);
      }, betweenTime > 2000 ? betweenTime : loadingTime);
    }
  }, [clickOpen, loadingTime]);

  const longLoading = (
    <>
      <div className={loadingType === 'medium' ? classes.animatedTitleMedium : classes.animatedTitle}>
        <div className={classes.textTop}>
          <div className={classes.textTopIn}>
            <span className={classes.firstText}>방송의 하이라이트</span>
            <svg viewBox="0 0 100 20" className={classes.secondText}>
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#a8c4f9" />
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
                fillOpacity="1"
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
          {loadingType === 'medium' ? (
            <div>잠시만 기다려 주세요</div>
          ) : (
            <div>오늘 방송 알찼나?</div>
          ) }
        </div>
      </div>
      {loadingType === 'medium' ? (
        null
      ) : (
        <div className={classes.wordCarousel}>
          <div className={classes.carouselWraper}>
            <ul className={classes.flip}>
              <li className={classes.styledText}>분석완료!</li>
              <li>잠시만요! 끝나가요</li>
              <li className={classes.styledText}>방송 분석중이에요</li>
            </ul>
          </div>
        </div>
      ) }
    </>
  );

  const shortLoading = (
    <div className={classes.shortWraper}>
      <img
        src="/images/logo/truepointLogo.png"
        alt="truepointLogo"
        width={70}
        height={70}
        className={classes.loadingShortLogo}
      />
      <Typography variant="h3" align="center" color="primary">
        TRUEPOINT
      </Typography>
    </div>
  );

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
          {loadingType === 'short' ? shortLoading : longLoading}
        </div>
      </Fade>
    </Modal>
  );
}
