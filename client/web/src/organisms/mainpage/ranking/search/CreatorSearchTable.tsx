import React, { useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Avatar, Chip, Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import { Pagination, PaginationItem, Rating } from '@material-ui/lab';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreatorListRes, Creator } from '@truepoint/shared/dist/res/CreatorList.interface';
import useAxios from 'axios-hooks';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useSearchTableStyle } from '../style/CreatorSearch.style';
import { usePaginationState } from '../../../../utils/hooks/usePaginationState';
import SearchInput from '../../shared/SearchInput';

function getCellStyle(isMobile: boolean): React.CSSProperties {
  return isMobile ? {
    padding: '4px 0',
    wordBreak: 'keep-all',
  } : {};
}

export default function CreatorSearchTable(): JSX.Element {
  const [{ data, loading }, getList] = useAxios<CreatorListRes>('users/creator-list');
  const {
    doSearch,
    searchText,
    clearSearchText,
    inputRef,
    handlePageChange,
  } = usePaginationState({ getList, itemPerPage: 20 });
  const classes = useSearchTableStyle();
  const theme = useTheme();
  const history = useHistory();
  const { isMobile } = useMediaSize();

  const onRowClick = (event: React.MouseEvent<Element, MouseEvent> | undefined, rowData: Creator | undefined) => {
    if (!rowData) return;
    const creatorId = rowData?.creatorId;
    history.push(`/ranking/creator/${creatorId}`);
  };

  const searchInput = useMemo(() => (
    <SearchInput
      doSearch={doSearch}
      searchText={searchText}
      clearSearchText={clearSearchText}
      inputRef={inputRef}
    />
  ), [clearSearchText, doSearch, inputRef, searchText]);

  return (
    <div className={classes.border}>
      <div className={classes.searchWrapper}>
        <Typography component="span">방송인 검색 </Typography>
        {searchInput}
      </div>

      <MaterialTable
        cellWidth={0}
        columns={[
          {
            width: '40%',
            align: 'center',
            title: '활동명',
            cellStyle: getCellStyle(isMobile),
            field: 'nickname',
            render: (rowData) => {
              const { platform, logo, nickname } = rowData;
              return (
                <div className={classes.info}>
                  <img
                    className={classes.platformLogo}
                    alt="logo"
                    src={`/images/logo/${platform}Logo.png`}
                  />
                  <Avatar className={classes.avatar} src={logo} />
                  <Typography noWrap component="span" className={classes.creatorName}>{nickname}</Typography>
                </div>
              );
            },
          },
          {
            width: '30%',
            align: 'center',
            title: '카테고리',
            cellStyle: getCellStyle(isMobile),
            render: (rowData) => {
              const { categories } = rowData;
              return (
                <div>
                  {categories.map((category) => (
                    <Chip
                      size={isMobile ? 'small' : 'medium'}
                      className={classes.categoryChip}
                      key={category}
                      label={category}
                    />
                  ))}
                </div>
              );
            },
          },
          {
            width: '30%',
            align: 'center',
            title: '평점',
            cellStyle: getCellStyle(isMobile),
            render: (rowData) => {
              const { averageRating } = rowData;
              return (
                <div>
                  <Rating size={isMobile ? 'small' : 'medium'} value={averageRating / 2} precision={0.5} readOnly />
                </div>
              );
            },
          },
        ]}
        data={data ? data.data : []}
        onRowClick={onRowClick}
        isLoading={loading}
        title="방송인 검색"
        components={{
          Pagination: () => (
            <td
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: 16,
              }}
            >
              <Pagination
                size={isMobile ? 'small' : 'medium'}
                renderItem={(item) => (<PaginationItem {...item} />)}
                variant="outlined"
                showFirstButton
                showLastButton
                onChange={handlePageChange}
                count={data ? data.totalPage : 1}
                page={data ? data.page : 1}
              />
            </td>
          ),
        }}
        options={{
          padding: isMobile ? 'dense' : 'default',
          showTitle: !isMobile,
          pageSize: 20,
          pageSizeOptions: [20],
          sorting: false,
          draggable: false,
          search: false,
          toolbar: false,
          headerStyle: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontSize: theme.typography[isMobile ? 'body2' : 'h6'].fontSize,
          },
          rowStyle: {
            fontSize: theme.typography[isMobile ? 'body2' : 'h6'].fontSize,
          },
          emptyRowsWhenPaging: false,
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
