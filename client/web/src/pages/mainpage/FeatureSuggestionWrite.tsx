import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FeatureWriteForm from '../../organisms/mainpage/featureSuggestion/FeatureWriteForm';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import AppBar from '../../organisms/shared/Appbar';
import useScrollTop from '../../utils/hooks/useScrollTop';
import useMediaSize from '../../utils/hooks/useMediaSize';

const useStyles = makeStyles((theme) => ({
  featureSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  featureContainer: {
    width: 968,
    margin: '60px auto',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

export default function FeatureSuggestionWrite(): JSX.Element {
  const classes = useStyles();
  const { isMobile } = useMediaSize();

  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (
    <div>
      <AppBar />

      {isMobile
        ? (
          <div className={classes.featureContainer}>
            <FeatureWriteForm />
          </div>
        )
        : (
          <>
            <ProductHero
              title="기능제안"
              content={`트루포인트 이용 중 추가되었으면 하는 기능이나 개선이 필요한 기능이 있다면 기능제안 게시판을 통해 제안해주세요.
                      궁금하신 사항은 고객센터로 연락 부탁드립니다.`}
            />

            <div className={classes.featureContainer}>
              <div className={classes.featureSection}>
                <Typography variant="h4" className={classes.title}>기능제안 게시판</Typography>
                <Typography variant="h6">기능개선이 필요한 사이트 및 상세정보를 적어주시면 정확하고 빠르게 답변이 가능합니다.</Typography>
              </div>
              <FeatureWriteForm />
            </div>
          </>

        )}
    </div>
  );
}
