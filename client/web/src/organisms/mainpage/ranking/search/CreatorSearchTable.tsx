import React from 'react';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Avatar, Chip } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import MaterialTable from '../../../../atoms/Table/MaterialTable';

export interface CreatorSearchTableProps {
  data: User[] | undefined;
  loading: boolean;
}

export default function CreatorSearchTable(props: CreatorSearchTableProps): JSX.Element {
  const { data, loading } = props;
  const theme = useTheme();
  const history = useHistory();
  const onRowClick = (event: React.MouseEvent<Element, MouseEvent> | undefined, rowData: User | undefined) => {
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
          width: '5%',
          align: 'center',
          title: ' ',
          render: (rowData) => <Avatar src={rowData.twitch?.logo || rowData.afreeca?.logo} />,
        },
        {
          width: '30%',
          align: 'center',
          title: '활동명',
          field: 'nickName',
        },
        {
          width: '30%',
          align: 'center',
          title: '카테고리',
          render: (rowData) => (
            <div>
              {rowData.twitch && rowData.twitch.categories && rowData.twitch.categories.map((category) => (
                <Chip
                  style={{ fontSize: theme.typography.body1.fontSize }}
                  key={category.categoryId}
                  label={category.name}
                />
              ))}
              {rowData.afreeca && rowData.afreeca.categories && rowData.afreeca.categories.map((category) => (
                <Chip
                  style={{ fontSize: theme.typography.body1.fontSize }}
                  key={category.categoryId}
                  label={category.name}
                />
              ))}
            </div>
          ),
        },
        // {
        //   width: '30%',
        //   align: 'center',
        //   title: '평점',
        // },
      ]}
      data={data || []}
      onRowClick={onRowClick}
      isLoading={loading}
      title="방송인 검색"
      options={{
        pageSize: 20,
        pageSizeOptions: [20, 40],
        searchFieldAlignment: 'left',
        headerStyle: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontSize: theme.typography.h6.fontSize,
        },
        searchFieldVariant: 'outlined',
        searchFieldStyle: {
          fontSize: theme.typography.h6.fontSize,
        },
        rowStyle: {
          fontSize: theme.typography.h6.fontSize,
        },
      }}
    />
  );
}
