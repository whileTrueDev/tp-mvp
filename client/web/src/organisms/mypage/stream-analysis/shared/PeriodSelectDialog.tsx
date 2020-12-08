import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Popper, Box, Grid, Divider, Button,
  Dialog, DialogContent, DialogTitle,
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
    width: '800px',
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
    justifyContent: 'flex-start',
    minHeight: '200px',
  },
  calendarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(2),
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
      // className={classes.popper}
      // placement="bottom-start"
      // anchorEl={anchorEl}
      // open={Boolean(anchorEl)}
      // disablePortal
      // modifiers={{
      //   flip: { enabled: false },
      //   preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
      //   hide: { enabled: false },
      // }}
      open={open}
      onClose={handleClose}
      // fullWidth
      maxWidth="lg"
    >
      <DialogContent
        className={classes.box}
        // style={{
        //   borderRadius: 4,
        //   borderColor: '#707070',
        //   border: '1px solid',
        // }}
      >
        {/* <Box
          boxShadow={1}
          borderRadius={16}
          borderColor="#707070"
          border={1}
          className={classes.box}
        > */}
        <Grid style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        >
          <Typography className={classes.boxTitle}>
            제외할 방송 선택
          </Typography>
        </Grid>

        <Grid className={classes.calendarWrapper}>
          <Calendar
            period={period}
            base={base}
            handleSelectedDate={handleSelectedDate}
            currDate={selectedDate}
            selectedStreams={selectedStreams}
          />
          {/* 클릭된 날짜의 방송 리스트 */}
          <div style={{ marginLeft: '16px', marginRight: '16px', width: '100%' }}>
            <PeriodStreamsList
              selectedStreams={selectedStreams}
              selectedDate={selectedDate}
              handleStreamList={handleStreamList}
              small
            />
          </div>

        </Grid>

        <Grid className={classes.listWrapper}>
          <Divider className={classes.divider} />
          <Typography className={classes.boxTitle}>
            기간 내 모든 방송
          </Typography>

          {/* 모든 방송 리스트 */}
          <PeriodStreamsList
            selectedStreams={selectedStreams}
            handleStreamList={handleStreamList}
          />
        </Grid>

        <Grid className={classes.listWrapper}>
          <Divider className={classes.divider} />
          <Typography className={classes.boxTitle}>
            제외 된 방송
          </Typography>
          {/* 제외된 방송 리스트 */}
          <PeriodStreamsList
            handleStreamList={handleStreamList}
            selectedStreams={selectedStreams.filter((streamItem) => streamItem.isRemoved === true)}
          />
        </Grid>

        <Button
          variant="contained"
            // onClick={handleAnchorClose}
          onClick={handleClose}
          className={classes.completeButton}
        >
          완료
        </Button>

        {/* </Box> */}
      </DialogContent>

    </Dialog>

  );
}
