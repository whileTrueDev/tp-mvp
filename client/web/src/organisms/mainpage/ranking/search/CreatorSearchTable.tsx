import React from 'react';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Avatar, Chip, Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useSearchTableStyle } from '../style/CreatorSearch.style';

export interface CreatorSearchTableProps {
  data: User[] | undefined;
  loading: boolean;
}

export default function CreatorSearchTable(props: CreatorSearchTableProps): JSX.Element {
  const { data, loading } = props;
  const classes = useSearchTableStyle();
  const theme = useTheme();
  const history = useHistory();
  const { isMobile } = useMediaSize();
  const onRowClick = (event: React.MouseEvent<Element, MouseEvent> | undefined, rowData: User | undefined) => {
    const platform = rowData?.afreeca ? 'afreeca' : 'twitch';
    const creatorId = rowData?.afreeca ? rowData?.afreeca.afreecaId : rowData?.twitch?.twitchId;
    history.push(`/ranking/${platform}/${creatorId}`);
  };
  return (
    <div className={classes.border}>
      <MaterialTable
        cellWidth={0}
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
            width: '50%',
            align: 'center',
            title: '활동명',
            field: 'nickName',
            render: (rowData) => (
              <div className={classes.info}>
                <Avatar style={{ marginRight: '8px' }} src={rowData.twitch?.logo || rowData.afreeca?.logo} />
                <Typography noWrap component="span">{rowData.nickName}</Typography>
              </div>
            ),
          },
          {
            width: '45%',
            align: 'center',
            title: '카테고리',
            render: (rowData) => (
              <div>
                {rowData.twitch && rowData.twitch.categories && rowData.twitch.categories.map((category) => (
                  <Chip
                    style={{ fontSize: theme.typography[isMobile ? 'body2' : 'body1'].fontSize }}
                    key={category.categoryId}
                    label={category.name}
                  />
                ))}
                {rowData.afreeca && rowData.afreeca.categories && rowData.afreeca.categories.map((category) => (
                  <Chip
                    style={{ fontSize: theme.typography[isMobile ? 'body2' : 'body1'].fontSize }}
                    key={category.categoryId}
                    label={category.name}
                  />
                ))}
              </div>
            ),
          },
        ]}
        data={data || []}
        onRowClick={onRowClick}
        isLoading={loading}
        title="방송인 검색"
        options={{
          padding: isMobile ? 'dense' : 'default',
          showTitle: !isMobile,
          pageSize: 20,
          pageSizeOptions: [20, 40],
          searchFieldAlignment: 'left',
          headerStyle: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontSize: theme.typography[isMobile ? 'body2' : 'h6'].fontSize,
          },
          searchFieldVariant: 'outlined',
          searchFieldStyle: {
            fontSize: theme.typography[isMobile ? 'body2' : 'h6'].fontSize,
          },
          rowStyle: {
            fontSize: theme.typography[isMobile ? 'body2' : 'h6'].fontSize,
          },

        }}
        style={{
          boxShadow: 'none',
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(1),
        }}
      />
    </div>
  );
}
