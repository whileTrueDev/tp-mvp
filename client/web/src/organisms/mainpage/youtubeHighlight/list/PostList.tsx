import React, { memo } from 'react';
import {
  Typography, TablePagination, Button, Grid, Avatar,
} from '@material-ui/core';
import {
  makeStyles, createStyles, Theme, useTheme,
} from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

// 응답타입
import { EditingPointListResType } from '@truepoint/shared/dist/res/EditingPointListResType.interface';
// 컴포넌트
import { Column } from 'material-table';
import Table from '../../../../atoms/Table/MaterialTable';
import AvatarWithName from '../../../../atoms/User/AvatarWithName';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { dayjsFormatter } from '../../../../utils/dateExpression';

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

interface PostListProps {
  posts: EditingPointListResType[],
  loading?: boolean,
  titleComponent: JSX.Element | undefined,
}

// 날짜표현함수
function getDateDisplay(createDate: Date|undefined): string {
  return createDate ? dayjsFormatter(createDate).fromNow() : '';
}

function PostList(props: PostListProps): JSX.Element {
  const {
    posts, loading, titleComponent,
  } = props;
  const theme = useTheme();
  const classes = useStyles();
  const { isMobile } = useMediaSize();

  const mobileColumns = [
    {
      title: '방송인',
      width: '70%',
      field: 'nickname',
      render: (rowData: EditingPointListResType): JSX.Element => {
        const { nickname, logo, endDate } = rowData;
        return (
          <Grid container spacing={1}>
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar alt={nickname} src={logo} />
            </Grid>
            <Grid item>
              <Typography variant="h6">{nickname}</Typography>
              <Typography variant="caption" color="textSecondary">{dayjsFormatter(endDate, 'YY.MM.DD HH:mm')}</Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      title: '편집점 살펴보기',
      width: '30%',
      align: 'center',
      field: 'userId',
      sorting: false,
      render: (rowData: EditingPointListResType): JSX.Element => {
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
  ] as Column<EditingPointListResType>[];

  const desktopColumns = [
    {
      title: '방송인',
      width: '40%',
      field: 'nickname',
      render: (rowData: EditingPointListResType): JSX.Element => {
        const { logo, nickname } = rowData;
        return (
          <>
            <AvatarWithName name={nickname} logo={logo} />
          </>
        );
      },
    },
    {
      title: '아이디',
      width: '20%',
      field: 'userId',
      render: (rowData: EditingPointListResType): JSX.Element => {
        const { userId } = rowData;
        return (
          <Typography variant="subtitle1" align="center" className={classes.columnText}>
            {userId}
          </Typography>
        );
      },
    },
    {
      title: '최근 방송',
      width: '10%',
      field: 'endDate',
      searchable: false,
      sorting: false,
      render: (rowData: EditingPointListResType): JSX.Element => {
        const { endDate } = rowData;
        return (
          <Typography variant="subtitle1" align="center" className={classes.columnText}>
            {getDateDisplay(endDate)}
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
      render: (rowData: EditingPointListResType): JSX.Element => {
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
  ] as Column<EditingPointListResType>[];

  return (
    <div className={classes.root}>
      <Table
        title={titleComponent}
        columns={isMobile ? mobileColumns : desktopColumns}
        data={posts || []}
        isLoading={loading}
        components={{
          Pagination: (Props) => (
            <TablePagination
              {...Props}
            />
          ),
        }}
        options={{
          search: true,
          pageSizeOptions: [10, 30, 50],
          pageSize: isMobile ? 10 : 30,
          searchFieldAlignment: 'right',
          headerStyle: {
            textAlign: 'center',
            fontWeight: 600,
            minWidth: 170,
            fontSize: theme.typography.body1.fontSize,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            wordBreak: 'keep-all',
          },
          header: !isMobile,
          showTitle: !isMobile,
          draggable: false,
          paginationType: 'stepped',
          toolbar: true,
          loadingType: 'linear',
          searchFieldStyle: { borderRadius: 8, backgroundColor: theme.palette.divider },
        }}
        style={{
          boxShadow: 'none',
          borderRadius: theme.spacing(2),
          border: `2px solid ${theme.palette.primary.main}`,
        }}
      />
    </div>
  );
}

export default memo(PostList);
