import React from 'react';
import { Container, Grid } from '@material-ui/core';
import CreatorSearchTable from './search/CreatorSearchTable';
import { useStyles } from './style/CreatorSearch.style';
import PageTitle from '../shared/PageTitle';
import MostSearchedCreatorList from './sub/MostSearchedCreatorList';

export default function CreatorSearch(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <Container className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <PageTitle text="방송인 검색" />
            <CreatorSearchTable />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MostSearchedCreatorList />
          </Grid>
        </Grid>

      </Container>
    </div>

  );
}
