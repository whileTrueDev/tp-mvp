import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FeatureWriteForm from '../../organisms/mainpage/featureSuggestion/FeatureWriteForm';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';

const useStyles = makeStyles((theme) => ({
  featureSection: {
    display: 'flex',
    margin: theme.spacing(3),
    padding: theme.spacing(3),
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
        <Typography variant="h4">기능제안</Typography>
        <Typography variant="h6">ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt non laudantium sint sunt, quos quam libero. Aliquam vel dicta,</Typography>
      </div>
      <FeatureWriteForm />
    </div>
  );
}
