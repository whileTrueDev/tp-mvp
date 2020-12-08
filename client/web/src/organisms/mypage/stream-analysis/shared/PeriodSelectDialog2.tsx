import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Grid, Divider, Button,
  Dialog, DialogContent,
} from '@material-ui/core';
// shared sub components
import Calendar from './Calendar';
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
  listWrapper: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '250px',
  },
  calendarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: theme.spacing(2),
    width: '100%',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
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
    period, base, selectedStreams, handleStreamList,
    open, handleClose,
  } = props;
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date(
    (period[0].getTime() + period[1].getTime()) / 2,
  ));

  const handleSelectedDate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
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
          {/* <Typography className={classes.boxTitle}>
            날짜별 방송 목록
          </Typography> */}

          <Grid className={classes.calendarWrapper} style={{ width: '30%' }}>
            <Typography className={classes.boxTitle}>
              기간 재선택
            </Typography>

            <Calendar
              period={period}
              base={base}
              handleSelectedDate={handleSelectedDate}
              currDate={selectedDate}
              selectedStreams={selectedStreams}
            />
            {/* 클릭된 날짜의 방송 리스트 */}
            <div style={{
              // marginLeft: '16px',
              marginRight: '16px',
              width: '100%',
              height: 250,
            }}
            >
              {/* <PeriodStreamsList
              selectedStreams={selectedStreams}
              selectedDate={selectedDate}
              handleStreamList={handleStreamList}
              small
            /> */}
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

          <Grid className={classes.listWrapper} style={{ width: '70%', height: 770 }}>
            {/* <Divider className={classes.divider} /> */}
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
        {/* <Grid className={classes.listWrapper}>
          <Divider className={classes.divider} />
          <Typography className={classes.boxTitle}>
            제외 된 방송
          </Typography>

          <PeriodStreamsList
            handleStreamList={handleStreamList}
            selectedStreams={selectedStreams.filter((streamItem) => streamItem.isRemoved === true)}
          />
        </Grid> */}

        <Button
          variant="contained"
            // onClick={handleAnchorClose}
          onClick={handleClose}
          className={classes.completeButton}
        >
          완료
        </Button>
      </DialogContent>

    </Dialog>

  );
}
