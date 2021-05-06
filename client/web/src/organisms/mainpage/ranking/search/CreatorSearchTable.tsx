import React from 'react';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { Avatar, Chip } from '@material-ui/core';
import { useHistory } from 'react-router';
import MaterialTable from '../../../../atoms/Table/MaterialTable';

export interface CreatorSearchTableProps {
  data: User[] | undefined;
}

export default function CreatorSearchTable(props: CreatorSearchTableProps): JSX.Element {
  const { data } = props;
  const history = useHistory();
  // event?: React.MouseEvent<Element, MouseEvent> | undefined, rowData?: User | undefined
  const onRowClick = (event: React.MouseEvent<Element, MouseEvent> | undefined, rowData: User | undefined) => {
    console.log(event, rowData);
    const platform = rowData?.afreeca ? 'afreeca' : 'twitch';
    const creatorId = rowData?.afreeca ? rowData?.afreeca.afreecaId : rowData?.twitch?.twitchId;
    history.push(`/ranking/${platform}/${creatorId}`);
  };
  return (
    <MaterialTable
      columns={[
        {
          width: '5%',
          align: 'center',
          render: (rowData) => (
            <img
              alt="logo"
              width="32"
              height="32"
              src={`/images/logo/${rowData.twitch ? 'twitch' : 'afreeca'}Logo.png`}
            />
          ),
        },
        {
          width: '20%',
          align: 'center',
          title: ' ',
          render: (rowData) => <Avatar src={rowData.twitch?.logo || rowData.afreeca?.logo} />,
        },
        {
          width: '20%',
          align: 'center',
          title: '활동명',
          field: 'nickName',
        },
        {
          width: '55%',
          align: 'center',
          title: '카테고리',
          render: (rowData) => (
            <div>
              {rowData.twitch?.categories && rowData.twitch?.categories.map(category => (
                <Chip key={category.categoryId} label={category.name}/>
              ))}
              {rowData.afreeca?.categories && rowData.afreeca?.categories.map(category => (
                <Chip key={category.categoryId} label={category.name}/>
              ))}
            </div>
          ),
        },
      ]}
      data={data || []}
      onRowClick={onRowClick}
    />
  );
}
