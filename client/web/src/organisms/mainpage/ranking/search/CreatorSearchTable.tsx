import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Avatar, Chip, Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { Creator } from '@truepoint/shared/dist/res/CreatorList.interface';
import useAxios from 'axios-hooks';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useSearchTableStyle } from '../style/CreatorSearch.style';

function getCellStyle(isMobile: boolean): React.CSSProperties {
  return isMobile ? {
    padding: '4px 0',
    wordBreak: 'keep-all',
  } : {};
}

export default function CreatorSearchTable(): JSX.Element {
  const [{ data, loading }] = useAxios<Creator[]>('users/creator-list');
  const classes = useSearchTableStyle();
  const theme = useTheme();
  const history = useHistory();
  const { isMobile } = useMediaSize();
  const onRowClick = (event: React.MouseEvent<Element, MouseEvent> | undefined, rowData: Creator | undefined) => {
    if (!rowData) return;
    const platform = rowData?.platform;
    const creatorId = rowData?.creatorId;
    history.push(`/ranking/${platform}/${creatorId}`);
  };
  return (
    <div className={classes.border}>
      <MaterialTable
        cellWidth={0}
        columns={[
          {
            width: '40%',
            align: 'center',
            title: '활동명',
            cellStyle: getCellStyle(isMobile),
            field: 'nickname',
            render: (rowData) => (
              <div className={classes.info}>
                <img
                  className={classes.platformLogo}
                  alt="logo"
                  src={`/images/logo/${rowData.platform}Logo.png`}
                />
                <Avatar className={classes.avatar} src={rowData.logo} />
                <Typography noWrap component="span" className={classes.creatorName}>{rowData.nickname}</Typography>
              </div>
            ),
          },
          {
            width: '30%',
            align: 'center',
            title: '카테고리',
            cellStyle: getCellStyle(isMobile),
            render: (rowData) => (
              <div>
                {rowData.categories.map((category) => (
                  <Chip
                    size={isMobile ? 'small' : 'medium'}
                    className={classes.categoryChip}
                    key={category}
                    label={category}
                  />
                ))}
              </div>
            ),
          },
          {
            width: '30%',
            align: 'center',
            title: '평점',
            cellStyle: getCellStyle(isMobile),
            render: (rowData) => (
              <div>
                <Rating size={isMobile ? 'small' : 'medium'} defaultValue={rowData.averageRating / 2} precision={0.5} readOnly />
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
