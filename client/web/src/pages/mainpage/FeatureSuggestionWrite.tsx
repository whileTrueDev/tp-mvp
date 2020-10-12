import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FeatureWriteForm from '../../organisms/mainpage/featureSuggestion/FeatureWriteForm';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';

const useStyles = makeStyles((theme) => ({
  featureSection: {
    display: 'flex',
    margin: theme.spacing(8),
    padding: theme.spacing(2),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  featureContainer: { width: 1400, margin: '100px auto', minHeight: 900 },
  contents: { margin: theme.spacing(4) },
}));

export default function FeatureSuggestionWrite(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <ProductHero
        title="기능제안"
        content="기능 개선과 제안된 기능을 도입하기 위해 끊임없이 연구하고 있습니다."
      />
      <div className={classes.featureSection}>
        <Typography variant="h4">기능제안 게시판</Typography>
        <Typography variant="h6">기능개선이 필요한 사이트 및 상세정보를 적어주시면 정확하고 빠르게 답변이 가능합니다.</Typography>
      </div>
      <FeatureWriteForm />
    </div>
  );
}
