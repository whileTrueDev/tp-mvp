import React, { useMemo } from 'react';
import {
  Typography, Button, Grid, Avatar,
} from '@material-ui/core';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Column, Options } from 'material-table';
import { Pagination, PaginationItem } from '@material-ui/lab';
import LazyLoad from 'react-lazyload';
// 응답타입
import { HighlightPointListResType, HighlightPointListItem } from '@truepoint/shared/dist/res/HighlightPointListResType.interface';

import Table from '../../../../atoms/Table/MaterialTable';
import AvatarWithName from '../../../../atoms/User/AvatarWithName';
import dateExpression from '../../../../utils/dateExpression';
import useMediaSize from '../../../../utils/hooks/useMediaSize';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginBottom: theme.spacing(2),
  },
  columnText: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      wordBreak: 'keep-all',
    },
  },
  columnButton: {
    backgroundColor: theme.palette.divider,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

interface HighlightlistTableProps {
  data: HighlightPointListResType | undefined,
  loading?: boolean,
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void
  header?: React.ComponentType<any> | undefined
  take: number
}

export default function HighlightlistTable(props: HighlightlistTableProps): JSX.Element {
  const {
    data, loading, handlePageChange, header, take,
  } = props;
  const classes = useStyles();
  const { isMobile } = useMediaSize();

  const mobileColumns = [
    {
      title: '방송인',
      width: '80%',
      field: 'nickname',
      render: (rowData: HighlightPointListItem): JSX.Element => {
        const { nickname, logo, endDate } = rowData;
        return (
          <Grid container spacing={1} wrap="nowrap">
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <LazyLoad height={40} placeholder={<Avatar />}>
                <Avatar alt={nickname} src={logo} />
              </LazyLoad>

            </Grid>
            <Grid item>
              <Typography variant="h6">{nickname}</Typography>
              <Typography variant="caption" color="textSecondary">
                {dateExpression({ compoName: 'highlight-table', createdAt: endDate })}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      title: '편집점 살펴보기',
      width: '20%',
      align: 'center',
      field: 'userId',
      sorting: false,
      render: (rowData: HighlightPointListItem): JSX.Element => {
        const { userId } = rowData;
        return (
          <Button
            className={classes.columnButton}
            component={Link}
            to={`/public-mypage/main/${userId}`}
          >
            <Typography variant="subtitle1" align="center" className={classes.columnText}>
              편집점 확인하기
            </Typography>
          </Button>
        );
      },
    },
  ] as Column<HighlightPointListItem>[];

  const desktopColumns = [
    {
      title: '방송인',
      width: '60%',
      field: 'nickname',
      render: (rowData: HighlightPointListItem): JSX.Element => {
        const { logo, nickname } = rowData;
        return (
          <LazyLoad height={40} placeholder={<Avatar />}>
            <AvatarWithName name={nickname} logo={logo} />
          </LazyLoad>
        );
      },
    },
    {
      title: '최근 방송',
      width: '10%',
      field: 'endDate',
      searchable: false,
      sorting: false,
      render: (rowData: HighlightPointListItem): JSX.Element => {
        const { endDate } = rowData;
        return (
          <Typography variant="subtitle1" align="center" className={classes.columnText}>
            {dateExpression({ compoName: 'fromNow', createdAt: endDate })}
          </Typography>
        );
      },
    },
    {
      title: '편집점 살펴보기',
      width: '30%',
      align: 'center',
      searchable: false,
      sorting: false,
      render: (rowData: HighlightPointListItem): JSX.Element => {
        const { userId } = rowData;
        return (
          <Button
            className={classes.columnButton}
            component={Link}
            to={`/public-mypage/main/${userId}`}
          >
            {/* 서버에서 받아오는 title이 가장 최근 방송 제목을 반영하지 않고 있음 */}
            {/* <Typography variant="subtitle1" align="center" className={classes.columnText}>
              {`${title.slice(0, 15)}`}
              {title.length > 15 ? '...' : null}
            </Typography> */}
            <Typography variant="subtitle1" align="center" className={classes.columnText}>
              편집점 확인
            </Typography>
          </Button>
        );
      },
    },
  ] as Column<HighlightPointListItem>[];

  const customPagination = () => (
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
  );

  const options: Options<HighlightPointListItem> = useMemo(() => ({
    padding: 'dense',
    search: false,
    pageSizeOptions: [take],
    pageSize: take,
    header: !isMobile,
    showTitle: false,
    draggable: false,
    toolbar: false,
    loadingType: 'linear',
  }), [isMobile, take]);

  return (
    <div className={classes.root}>
      <Table
        columns={isMobile ? mobileColumns : desktopColumns}
        data={data ? data.data : []}
        isLoading={loading}
        components={{
          Pagination: customPagination,
          Header: header,
        }}
        options={options}
        style={{
          boxShadow: 'none',
        }}
      />
    </div>
  );
}
