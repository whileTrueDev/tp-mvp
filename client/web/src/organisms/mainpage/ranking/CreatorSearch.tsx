import useAxios from 'axios-hooks';
import React from 'react';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import CreatorSearchTable from './search/CreatorSearchTable';

export interface CreatorSearchProps {

}

export default function CreatorSearch(props: CreatorSearchProps): JSX.Element {
  const [{ data, loading, error }, refetch] = useAxios<User[]>('/users/id-list');

  return (
    <div>
      <CreatorSearchTable
        data={data}
      />

    </div>
  );
}
