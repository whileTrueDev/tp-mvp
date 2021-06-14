import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Grid, Divider, Button,
  Dialog, DialogContent, Collapse,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import classnames from 'classnames';

// shared sub components
import RangeSelectCalendar from './RangeSelectCalendar';
import PeriodStreamsList from './PeriodStreamsList';
// interfaces
import { PeriodSelectDialogProps } from './StreamAnalysisShared.interface';

const useStyles = makeStyles((theme: Theme) => ({
  popper: {
    marginTop: theme.spacing(2),
    zIndex: 900, // 마이페이지 내부 컴포넌트 < popper < 마이페이지 상단 네비바 && 최상단 네비바
  },
  box: {
    width: '100%',
    minHeight: '855px',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  dialogBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  leftSection: { width: 600 },
  rightSection: { width: 650, height: 770 },
  boxTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontWeight: 'bold',
    fontSize: '23px',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
  allStreamListWrapper: {
    width: '100%',
    height: 276,
    marginTop: 24,
    marginRight: 16,
  },
  listWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minHeight: '250px',
  },
  calendarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  calendar: { display: 'flex', justifyContent: 'center' },
  divider: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  bottomWrapper: { marginTop: theme.spacing(1) },
  completeButton: {
    height: theme.spacing(5),
    alignSelf: 'flex-end',
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  alertBody: {
    marginRight: theme.spacing(2),
    height: theme.spacing(5),
    alignItems: 'center',
  },
}));

export default function PeriodSelectDialog(props: PeriodSelectDialogProps): JSX.Element {
  const {
    period, base, selectedStreams, open,
    handleStreamList, handleClose,
    handlePeriod,
    exampleMode = false,
  } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 4,
        },
      }}
    >
      <DialogContent className={classes.box}>
        <Grid className={classes.dialogBody}>
          <Grid className={classnames(classes.calendarWrapper, classes.leftSection)}>
            <Typography className={classes.boxTitle} style={{ marginBottom: 16 }}>
              기간 재선택
            </Typography>

            <div className={classes.calendar}>
              <RangeSelectCalendar
                exampleMode={exampleMode}
                period={period}
                handlePeriod={handlePeriod}
                handleDialogClose={handleClose}
                base={base}
              />
            </div>

            <Divider />
            {/* 클릭된 날짜의 방송 리스트 */}
            <div className={classes.allStreamListWrapper}>
              <Typography className={classes.boxTitle}>
                제외 된 방송
              </Typography>

              <PeriodStreamsList
                small
                handleStreamList={handleStreamList}
                selectedStreams={selectedStreams.filter((streamItem) => streamItem.isRemoved === true)}
              />
            </div>

          </Grid>
          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />

          <Grid className={classnames(classes.listWrapper, classes.rightSection)}>
            <Typography className={classes.boxTitle}>
              기간 내 모든 방송 목록
            </Typography>

            {/* 모든 방송 리스트 */}
            <PeriodStreamsList
              selectedStreams={selectedStreams}
              handleStreamList={handleStreamList}
            />
          </Grid>
        </Grid>

        <Grid container justify="flex-end" alignItems="flex-end" className={classes.bottomWrapper}>
          <Collapse in={selectedStreams.filter((each) => !each.isRemoved).length < 2}>
            <Alert severity="error" className={classes.alertBody}>
              선택하신 기간내에 2개 이상의 방송이 포함되어야 합니다.
            </Alert>
          </Collapse>
          <Button
            variant="contained"
            onClick={handleClose}
            className={classes.completeButton}
            disabled={selectedStreams.filter((each) => !each.isRemoved).length < 2}
          >
            완료
          </Button>
        </Grid>

      </DialogContent>

    </Dialog>

  );
}
