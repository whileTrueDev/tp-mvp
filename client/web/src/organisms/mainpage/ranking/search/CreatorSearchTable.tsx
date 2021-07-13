import React, { useMemo } from 'react';
import {
  Avatar, Chip, Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTheme } from '@material-ui/core/styles';
import {
  // Pagination, PaginationItem,
  Rating,
} from '@material-ui/lab';
import { CreatorListRes, Creator } from '@truepoint/shared/dist/res/CreatorList.interface';
import useAxios from 'axios-hooks';
import LazyLoad from 'react-lazyload';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useSearchTableStyle } from '../style/CreatorSearch.style';
import { usePaginationState } from '../../../../utils/hooks/usePaginationState';
import SearchInput from '../../shared/SearchInput';
import CustomPagination from '../../../../atoms/CustomPagination';

function getCellStyle(isMobile: boolean): React.CSSProperties {
  return isMobile ? {
    padding: 0,
    whiteSpace: 'pre',
    wordBreak: 'keep-all',
  } : {};
}

export default function CreatorSearchTable(): JSX.Element {
  const [{ data, loading }, getList] = useAxios<CreatorListRes>('users/creator-list');
  const [, increaseSearchCount] = useAxios({
    url: 'users/creator-list',
    method: 'post',
  }, { manual: true });
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
    // 검색횟수 증가 요청
    increaseSearchCount({
      data: {
        creatorId,
      },
    }).then(() => {
      history.push(`/ranking/creator/${creatorId}`);
    }).catch((error) => console.error(error));
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
            width: '30%',
            align: 'center',
            title: '활동명',
            cellStyle: getCellStyle(isMobile),
            field: 'nickname',
            render: (rowData) => {
              const { platform, logo, nickname } = rowData;
              return (
                <div className={classes.info}>
                  <LazyLoad height={isMobile ? 24 : 40}>
                    <img
                      width={isMobile ? 24 : 40}
                      height={isMobile ? 24 : 40}
                      className={classes.platformLogo}
                      alt="logo"
                      src={`/images/logo/${platform}Logo.png`}
                    />
                  </LazyLoad>
                  <LazyLoad height={isMobile ? 24 : 40} placeholder={<Avatar className={classes.avatar} />}>
                    <Avatar className={classes.avatar} src={logo} />
                  </LazyLoad>

                  <Typography noWrap component="span" className={classes.creatorName}>{nickname}</Typography>
                </div>
              );
            },
          },
          {
            width: '20%',
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
            width: '25%',
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
          {
            width: '25%',
            align: 'center',
            title: '검색횟수',
            cellStyle: getCellStyle(isMobile),
            render: (rowData) => {
              const { searchCount } = rowData;
              return (
                <Typography noWrap component="span" variant="caption" color="textSecondary">{searchCount}</Typography>
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
            <td>
              <CustomPagination
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : undefined}
                showFirstButton
                showLastButton
                onChange={handlePageChange}
                count={data ? data.totalPage : 1}
                page={data ? data.page : 1}
              />
              {/* <Pagination
                size={isMobile ? 'small' : 'medium'}
                renderItem={(item) => (<PaginationItem {...item} />)}
                variant="outlined"
                showFirstButton
                showLastButton
                onChange={handlePageChange}
                count={data ? data.totalPage : 1}
                page={data ? data.page : 1}
              /> */}
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
            fontSize: isMobile ? 10 : theme.typography.h6.fontSize,
            whiteSpace: 'pre',
          },
          rowStyle: {
            fontSize: theme.typography[isMobile ? 'body2' : 'h6'].fontSize,
          },
          emptyRowsWhenPaging: false,
        }}
        style={{
          boxShadow: 'none',
          backgroundColor: theme.palette.background.paper,
        }}
      />
    </div>
  );
}
