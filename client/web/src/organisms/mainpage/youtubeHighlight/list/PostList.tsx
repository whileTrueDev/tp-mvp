import React, { memo } from 'react';
import { Typography, TablePagination, Button } from '@material-ui/core';
import {
  makeStyles, createStyles, Theme, useTheme,
} from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

// 라이브러리
import { ko } from 'date-fns/locale';
import * as dateFns from 'date-fns';
// 응답타입
import { EditingPointListResType } from '@truepoint/shared/dist/res/EditingPointListResType.interface';
// 컴포넌트
import Table from '../../../../atoms/Table/MaterialTable';
import AvatarWithName from '../../../../atoms/User/AvatarWithName';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginBottom: theme.spacing(2),
  },
  columnText: {
    fontWeight: theme.typography.fontWeightBold,
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
  let dateDisplay = '';
  if (createDate) {
    const date = new Date(createDate);
    if (date.getDate() === new Date().getDate()) {
      dateDisplay = `${dateFns.formatDistanceToNow(date, { locale: ko }).replace('약 ', '')} 전`;
    } else {
      dateDisplay = dateFns.format(date, 'yy-MM-dd');
    }
  }
  return dateDisplay;
}

function PostList(props: PostListProps): JSX.Element {
  const {
    posts, loading, titleComponent,
  } = props;
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Table
        title={titleComponent}
        columns={[
          {
            title: '방송인',
            width: '25%',
            field: 'nickName',
            render: (rowData: EditingPointListResType): JSX.Element => (
              <>
                <AvatarWithName name={rowData.nickname} logo={rowData.logo} />
              </>
            ),
          },
          {
            title: '아이디',
            width: '20%',
            field: 'userId',
            render: (rowData: EditingPointListResType): JSX.Element => (
              <Typography variant="subtitle1" align="center" className={classes.columnText}>
                {rowData.userId}
              </Typography>
            ),
          },
          {
            title: '최근 방송',
            width: '25%',
            field: 'endDate',
            render: (rowData: EditingPointListResType): JSX.Element => (
              <Typography variant="subtitle1" align="center" className={classes.columnText}>
                {getDateDisplay(rowData.endDate)}
              </Typography>
            ),
          },
          {
            title: '편집점 살펴보기',
            width: '30%',
            align: 'center',
            render: (rowData: EditingPointListResType): JSX.Element => (
              <Button
                className={classes.columnButton}
                component={Link}
                to={`/public-mypage/main/${rowData.userId}`}
              >
                <Typography variant="subtitle1" align="center" className={classes.columnText}>
                  {`${rowData.title.slice(0, 15)}`}
                  {rowData.title.length > 15 ? '...' : null}
                </Typography>
              </Button>
            ),
          },
        ]}
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
          pageSize: 30,
          pageSizeOptions: [30, 50],
          searchFieldAlignment: 'right',
          headerStyle: {
            textAlign: 'center', fontWeight: 600, fontSize: 20, backgroundColor: theme.palette.primary.main, color: theme.palette.common.white,
          },
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
