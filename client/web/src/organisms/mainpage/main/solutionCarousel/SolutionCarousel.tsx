import { Container, useMediaQuery } from '@material-ui/core';
import React from 'react';
import Slider from 'react-slick';
import styles from '../style/SolutionCarousel.style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function SolutionCarousel(): JSX.Element {
  const classes = styles();
  const isXsWidth = useMediaQuery('(max-width:600px)');

  const settings = {
    customPaging(i: number): JSX.Element {
      return (
        <div data-id={i} className={classes.dot}>
          {(i === 0) && <span>일백번</span>}
          {(i === 1) && <span>사나건</span>}
          {(i === 2) && <span>진로되어</span>}
          {(i === 3) && <span>캐러셀</span>}
        </div>
      );
    },
    className: 'center',
    dots: true,
    infinite: true,
    centerMode: true,
    speed: 500,
    slidesToShow: isXsWidth ? 1 : 3,
    pauseOnHover: false,
  };

  return (
    <div className={classes.root}>
      <Container className={classes.front}>
        <div className={classes.mainSubTitle}>
          시청자들의 다양한 반응을
        </div>
        <div className={classes.mainTitle}>
          차트로 확인할 수 있습니다
        </div>
        <Slider {...settings} className={classes.slider}>
          <div className={classes.carousel}>
            <div className={classes.content}>
              1번 그림 준비해주세용
            </div>
          </div>
          {!isXsWidth
            && (
            <div className={classes.carousel}>
              <div className={classes.content}>
                2번 그림 준비해주세용
              </div>
            </div>
            )}
          {!isXsWidth
            && (
            <div className={classes.carousel}>
              <div className={classes.content}>
                3번 그림 준비해주세용
              </div>
            </div>
            )}
          {!isXsWidth
            && (
            <div className={classes.carousel}>
              <div className={classes.content}>
                4번 그림 준비해주세용
              </div>
            </div>
            )}
        </Slider>
      </Container>
      <div className={classes.back} />

    </div>
  );
}
