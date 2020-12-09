import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Grid, Divider, Button,
  Dialog, DialogContent,
} from '@material-ui/core';

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
    width: '100%',
  },
  calendar: { display: 'flex', justifyContent: 'center' },
  divider: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  completeButton: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

export default function PeriodSelectDialog(props: PeriodSelectDialogProps): JSX.Element {
  const {
    period, base, selectedStreams, open,
    handleStreamList, handleClose,
    handlePeriod,
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
      <DialogContent
        className={classes.box}
      >
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
            width: '100%',
          }}
        >
          <Grid className={classes.calendarWrapper} style={{ width: 600 }}>
            <Typography className={classes.boxTitle} style={{ marginBottom: 16 }}>
              기간 재선택
            </Typography>

            <div className={classes.calendar}>
              <RangeSelectCalendar
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

          <Grid className={classes.listWrapper} style={{ width: 650, height: 770 }}>
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

        <Button
          variant="contained"
          onClick={handleClose}
          className={classes.completeButton}
        >
          완료
        </Button>
      </DialogContent>

    </Dialog>

  );
}
