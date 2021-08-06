import {
  Grid,
  TableBody, TableCell, TablePagination, TableRow, Typography,
} from '@material-ui/core';
import {
  makeStyles, useTheme, Theme, createStyles,
} from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import React, { useState } from 'react';
import shortid from 'shortid';
import { FeatureProgressChip } from '../../../atoms/Chip/FeatureProgressChip';
import Table from '../../../atoms/Table/MaterialTable';
// 날짜표현 컴포넌트 추가
import { dayjsFormatter } from '../../../utils/dateExpression';
import { useCheckPassword } from '../../../utils/hooks/mutation/useCheckPassword';
import useDialog from '../../../utils/hooks/useDialog';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
import CheckPasswordDialog from '../shared/CheckPasswordDialog';

const TABLE_ROW_HEIGHT = 45;
const useStyles = makeStyles((theme) => ({
  tableRow: {
    height: TABLE_ROW_HEIGHT,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tableCell: {
    padding: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
  },
  commentCount: { marginLeft: theme.spacing(1), fontWeight: 'bold' },
  lockIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    marginLeft: '8px',
  },
}));

const useMobileCellStyle = makeStyles((theme: Theme) => createStyles({
  mobileCell: {
    padding: 0,
  },
  categoryText: {
    wordBreak: 'keep-all',
    fontSize: theme.typography.subtitle2.fontSize,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(1),
  },
  title: {
    fontSize: theme.typography.subtitle1.fontSize,
  },
  infoRow: {
    display: 'flex',
    '&>*': {
      marginRight: theme.spacing(1),
      fontSize: theme.typography.body2.fontSize,
    },
    '& .date': {
      color: theme.palette.text.secondary,
    },
    '& .state': {
      flex: 1,
      textAlign: 'end',
    },

  },
}));

function MobileRowCells({ row }: {row: Omit<FeatureSuggestion, 'content'>}): JSX.Element {
  const classes = useMobileCellStyle();
  return (
    <>
      <TableCell className={classes.mobileCell}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <Typography align="center" className={classes.categoryText}>
              {row.category}
            </Typography>
          </Grid>
          <Grid item xs={10} container direction="column">
            <Typography component="span" className={classes.title}>
              {row.title}
              {row.replies && row.replies.length > 0 && (
                <Typography component="span" color="primary">{`(${row.replies.length})`}</Typography>
              )}
              {row.isLock && (
              <LockIcon color="primary" fontSize="small" />
              )}
            </Typography>
            <div className={classes.infoRow}>
              <Typography className="date">
                {dayjsFormatter(row.createdAt).fromNow()}
              </Typography>
              <Typography className="state">{FeatureProgressChip(row.state)}</Typography>

            </div>

          </Grid>

        </Grid>
      </TableCell>
    </>
  );
}

function DesktopRowCells({ row: eachRow }: {row: Omit<FeatureSuggestion, 'content'>}): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <TableCell className={classes.tableCell} scope="row" align="center">
        {eachRow.suggestionId}
      </TableCell>
      <TableCell className={classes.tableCell} scope="row" align="center">
        {eachRow.category}
      </TableCell>
      <TableCell className={classes.tableCell} scope="row" align="center">
        {transformIdToAsterisk(eachRow.author ? eachRow.author.userId : eachRow.userIp)}
      </TableCell>
      <TableCell className={classes.tableCell} scope="row" align="left">

        {eachRow.title}
        {eachRow.replies && eachRow.replies.length > 0 && (
        <Typography variant="caption" color="primary" className={classes.commentCount} component="span">
          {`(${eachRow.replies.length})`}
        </Typography>
        )}
        {eachRow.isLock && (
        <LockIcon
          color="primary"
          fontSize="small"
          className={classes.lockIcon}
        />
        )}

      </TableCell>
      <TableCell className={classes.tableCell} scope="row" align="center">
        {dayjsFormatter(eachRow.createdAt, 'll')}
      </TableCell>
      <TableCell className={classes.tableCell} scope="row" align="center">
        {FeatureProgressChip(eachRow.state)}
      </TableCell>
    </>
  );
}

export interface FeatureTableProps {
  isLoading: boolean;
  metrics: Omit<FeatureSuggestion, 'content' | 'replies'>[];
  page: number;
  pageSize: number;
  handlePage: any;
  handlePageSize: any;
  handleClick: (a: any) => void;
}
export default function FeatureTable({
  isLoading,
  metrics,
  handleClick,
  page,
  pageSize,
  handlePage,
  handlePageSize,
}: FeatureTableProps): JSX.Element {
  const emptyRows = pageSize - Math.min(pageSize, metrics.length - page * pageSize);
  const classes = useStyles();
  const theme = useTheme();
  const { isMobile } = useMediaSize();

  // 현재 사용자와 기능제안 글쓴이가 같은 사람인지 체크하기 위해
  const confirmDialog = useDialog();

  // 비밀번호 확인 요청
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<number>();
  function handleSelect(suggestionId: number) {
    setSelectedSuggestionId(suggestionId);
  }
  const { mutateAsync: checkPassword } = useCheckPassword(`/feature-suggestion/${selectedSuggestionId}/password`);
  return (
    <>
      <Table<Omit<FeatureSuggestion, 'content' | 'replies'>>
        columns={[
          {
            width: '50px',
            align: 'center',
            title: ' ',
          },
          {
            width: '150px',
            align: 'center',
            title: '카테고리',
          },
          {
            width: '150px',
            align: 'center',
            title: '작성자',
          },
          {
            width: '300px',
            align: 'center',
            title: '제목',
          },
          {
            width: '200px',
            align: 'center',
            title: '작성일',
          },
          {
            width: '150px',
            align: 'center',
            title: '진행상태',
          },
        ]}
        data={metrics || []}
        components={{
          Pagination: (props) => (
            <TablePagination
              {...props}
              page={page}
            />
          ),
          Body: () => (
            <TableBody>
              {(pageSize > 0
                // eslint-disable-next-line react/prop-types
                ? metrics.slice(page * pageSize, page * pageSize + pageSize)
                : metrics
              ).map((eachRow: Omit<FeatureSuggestion, 'content'>) => (
                <TableRow
                  className={classes.tableRow}
                  key={shortid.generate()}
                  onClick={() => {
                    handleSelect(eachRow.suggestionId);
                    if (eachRow.isLock) {
                      confirmDialog.handleOpen();
                    } else handleClick(eachRow.suggestionId);
                  }}
                >

                  {isMobile
                    ? <MobileRowCells row={eachRow} />
                    : (
                      <DesktopRowCells row={eachRow} />
                    )}

                </TableRow>
              ))}
              {emptyRows > 0 && !isMobile && (
                <TableRow style={{ height: TABLE_ROW_HEIGHT * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          ),
        }}
        isLoading={isLoading}
        onChangePage={handlePage}
        onChangeRowsPerPage={handlePageSize}
        options={{
          toolbar: false,
          sorting: false,
          search: false,
          pageSize,
          pageSizeOptions: [8, 12],
          header: !isMobile,
          headerStyle: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontSize: theme.typography.subtitle1.fontSize,
          },
          draggable: false,
          paginationType: 'stepped',
        }}
        style={{ boxShadow: 'none' }}
      />

      <CheckPasswordDialog
        open={confirmDialog.open}
        onClose={confirmDialog.handleClose}
        checkPassword={checkPassword}
        successHandler={() => {
          handleClick(selectedSuggestionId);
          confirmDialog.handleClose();
        }}
      />
    </>
  );
}
