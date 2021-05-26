import useAxios from 'axios-hooks';
import React from 'react';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { Container } from '@material-ui/core';
import CreatorSearchTable from './search/CreatorSearchTable';
import { useStyles } from './style/CreatorSearch.style';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import PageTitle from '../shared/PageTitle';

export default function CreatorSearch(): JSX.Element {
  const [{ data, loading }] = useAxios<User[]>('/users/id-list');
  const classes = useStyles();
  const { isMobile } = useMediaSize();

  return (
    <Container maxWidth="md" className={classes.container}>
      {isMobile && <PageTitle text="방송인 검색" />}
      <CreatorSearchTable
        data={data}
        loading={loading}
      />
    </Container>
  );
}
