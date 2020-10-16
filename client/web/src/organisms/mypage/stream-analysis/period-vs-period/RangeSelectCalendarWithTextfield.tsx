import React from 'react';
// material-ui core components
import {
  Grid, Typography, TextField, Paper,
} from '@material-ui/core';
// date library
import moment from 'moment';
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import usePeriodCompareStyles from './PeriodCompareSection.style';
// svg icons
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
// interfaces
import {
  PeriodCompareCalendarAndTextfieldProps,
  ISODateTextFieldError,
} from './PeriodCompareSection.interface';
// custom hooks
import useEventTargetValue from '../../../../utils/hooks/useEventTargetValue';
// subscomponent
import RangeSelectCaledar from './RangeSelectCalendar';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    '& label.Mui-focused': {
      color: '#909090',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#909090',
    },
    width: '185px',
    height: '35px',
  },
  base: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#3a86ff',
      },
    },
  },
  compare: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#6e6e6e',
      },
    },
  },
}));

export default function RangeSelectCalendarWithTextfield(
  props: PeriodCompareCalendarAndTextfieldProps,
): JSX.Element {
  const textClasses = useStyles();
  const classes = usePeriodCompareStyles();
  const {
    base, handlePeriod, handleError,
  } = props;
  const start = useEventTargetValue();
  const end = useEventTargetValue();
  const [startDateError, setStartDateError] = React.useState<ISODateTextFieldError>({
    helperText: '',
    isError: false,
  });
  const [endDateError, setEndDateError] = React.useState<ISODateTextFieldError>({
    helperText: '',
    isError: false,
  });
  const [period, setPeriod] = React.useState<Date[]>(new Array<Date>(2));

  React.useEffect(() => {
    if (start.value.length > 9) {
      if (!moment(start.value, 'YYYY-MM-DD').isValid()) {
        setStartDateError({ helperText: '유효하지 않은 날짜 형식입니다.', isError: true });
      } else {
        setStartDateError({ helperText: '', isError: false });
      }

      if (end.value.length > 9) {
        if (!moment(end.value, 'YYYY-MM-DD').isValid()) {
          setEndDateError({ helperText: '유효하지 않은 날짜 형식입니다.', isError: true });
        }

        if (moment(start.value, 'YYYY-MM-DD').isValid()
        && moment(end.value, 'YYYY-MM-DD').isValid()) {
          setEndDateError({ helperText: '', isError: false });

          const startDate = new Date(start.value);
          const endDate = new Date(end.value);

          if (startDate.getTime() <= endDate.getTime()) {
            setPeriod([startDate, endDate]);
          } else {
            setPeriod([endDate, startDate]);
          }
        }
      }
    }
  }, [start.value, end.value, base]);

  const onStartTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (start.handleChangeISODateNumber) start.handleChangeISODateNumber(e);
    if (
      moment(e.target.value, 'YYYY-MM-DD').isValid()
      && moment(end.value, 'YYYY-MM-DD').isValid()
      && e.target.value.length > 9
    ) {
      if (moment(e.target.value, 'YYYY-MM-DD').isBefore(moment(end.value, 'YYYY-MM-DD'))) {
        handlePeriod(new Date(e.target.value), new Date(end.value), base);
      } else if (moment(e.target.value, 'YYYY-MM-DD').isSame(moment(end.value, 'YYYY-MM-DD'))) {
        const endDate = new Date(e.target.value);
        endDate.setDate(endDate.getDate() + 1);
        handlePeriod(new Date(e.target.value), endDate, base);
        end.setValue(endDate.toISOString().slice(0, 10));
      } else {
        handlePeriod(new Date(end.value), new Date(e.target.value), base);
        const tempDate = end.value;
        start.setValue(tempDate);
        end.setValue(e.target.value);
      }
    }
  };

  const onEndTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (end.handleChangeISODateNumber) end.handleChangeISODateNumber(e);
    if (
      moment(e.target.value, 'YYYY-MM-DD').isValid()
      && moment(start.value, 'YYYY-MM-DD').isValid()
      && e.target.value.length > 9
    ) {
      if (moment(e.target.value, 'YYYY-MM-DD').isAfter(moment(start.value, 'YYYY-MM-DD'))) {
        handlePeriod(new Date(e.target.value), new Date(end.value), base);
      } else if (moment(e.target.value, 'YYYY-MM-DD').isSame(moment(start.value, 'YYYY-MM-DD'))) {
        const endDate = new Date(e.target.value);
        endDate.setDate(endDate.getDate() + 1);
        handlePeriod(new Date(e.target.value), endDate, base);
        end.setValue(endDate.toISOString().slice(0, 10));
      } else {
        handlePeriod(new Date(e.target.value), new Date(start.value), base);
        const tempDate = start.value;
        end.setValue(tempDate);
        start.setValue(e.target.value);
      }
    }
  };

  const handleTextFieldPeriod = (startAt: Date, endAt: Date) => {
    const periodObj = {
      startAt, endAt,
    };

    /* 하루 선택시 이틀로 자동 변경 */
    if (periodObj.endAt.getDate() === periodObj.startAt.getDate()) {
      periodObj.endAt.setDate(periodObj.endAt.getDate() + 1);
    }

    handlePeriod(periodObj.startAt, periodObj.endAt, base);
    start.setValue(periodObj.startAt.toISOString().slice(0, 10));
    end.setValue(periodObj.endAt.toISOString().slice(0, 10));
  };

  return (

    <Grid item className={classes.bodyContainer}>
      {/* 달력 연동 기간 텍스트 박스 */}
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <TextField
            placeholder="YYYY-MM-DD"
            variant="outlined"
            error={startDateError.isError}
            helperText={startDateError.helperText}
            value={start.value}
            onChange={onStartTextChange}
            inputProps={{
              maxLength: 10,
              style: {
                textAlign: 'center',
                fontFamily: 'AppleSDGothicNeo',
                fontSize: '20px',
                fontWeight: 440,
              },
            }}
            className={classnames({
              [textClasses.textField]: true,
              [textClasses.base]: base,
              [textClasses.compare]: !base,
            })}
          />
        </Grid>
        <Grid item style={{ height: '100%' }}>
          <Typography variant="h5" style={{ paddingTop: '10px' }}>
            ~
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="YYYY-MM-DD"
            error={endDateError.isError}
            helperText={endDateError.helperText}
            value={end.value}
            onChange={onEndTextChange}
            inputProps={{
              maxLength: 10,
              style: {
                textAlign: 'center',
                fontFamily: 'AppleSDGothicNeo',
                fontSize: '20px',
                fontWeight: 440,
              },
            }}
            className={classnames({
              [textClasses.textField]: true,
              [textClasses.base]: base,
              [textClasses.compare]: !base,
            })}
          />
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.bodyPapper}>
        <Typography className={classes.bodyTitle}>
          <SelectDateIcon className={classes.bodyTitleIcon} />

          <span
            style={base && { color: '#2f5fac' }}
            className={classes.bodyTitleHighlite}
          >
            {base ? '기준 방송' : '비교 방송'}
          </span>

          기간 선택
        </Typography>
        {/* 텍스트 박스 연동 기간 선택 달력 */}
        <RangeSelectCaledar
          handlePeriod={handleTextFieldPeriod}
          period={period}
          handleError={handleError}
          base={base ? true : undefined}
        />
      </Paper>

    </Grid>
  );
}
