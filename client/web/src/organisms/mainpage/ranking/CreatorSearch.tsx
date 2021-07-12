import React from 'react';
import { Container } from '@material-ui/core';
import CreatorSearchTable from './search/CreatorSearchTable';
import { useStyles } from './style/CreatorSearch.style';
import PageTitle from '../shared/PageTitle';

export default function CreatorSearch(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <Container className={classes.container}>
        <PageTitle text="방송인 검색" />
        <CreatorSearchTable />
      </Container>
    </div>

  );
}
