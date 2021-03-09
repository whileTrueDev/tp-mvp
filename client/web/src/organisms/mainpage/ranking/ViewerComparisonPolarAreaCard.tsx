import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import CenterLoading from '../../../atoms/Loading/CenterLoading';

const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {},
}));

function ViewerComparisonPolarAreaCard(): JSX.Element {
  const classes = useStyles();
  const [{ data, loading, error }] = useAxios('/rankings/daily-total-viewers');

  if (error) {
    console.error(error);
  }
  return (
    <section className={classes.polarAreaContainer}>
      비교차트
      {JSON.stringify(data, null, 2)}
      {loading && <CenterLoading />}
    </section>
  );
}

export default ViewerComparisonPolarAreaCard;
