import React from 'react';
// material-ui core components
import {
  Grid, Typography, TextField,
} from '@material-ui/core';
// date library
import moment from 'moment';
// styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// interfaces
import { periodCompareTextBoxProps, ISODateTextFieldError } from './PeriodCompareHero.interface';
// custom hooks
import useEventTargetValue from '../../../../utils/hooks/useEventTargetValue';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    '& label.Mui-focused': {
      color: '#909090',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#909090',
    },
    width: '178px',
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
  }
}));

export default function periodCompareTextField(props: periodCompareTextBoxProps): JSX.Element {
  const classes = useStyles();
  const { base, period, handleperiod } = props;
  const start = useEventTargetValue();
  const end = useEventTargetValue();
  const [startDateError, setStartDateError] = React.useState<ISODateTextFieldError>({
    helperText: '',
    isError: false
  });
  const [endDateError, setEndDateError] = React.useState<ISODateTextFieldError>({
    helperText: '',
    isError: false
  });

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
            handleperiod(new Date(start.value), new Date(end.value), base);
          } else {
            handleperiod(new Date(end.value), new Date(start.value), base);
          }
        }
      }
    }
  }, [start.value, end.value]);

  React.useEffect(() => {
    if (period[0] && period[1]
      && moment(period[0].toISOString(), 'YYYY-MM-DD').isValid()
      && moment(period[1].toISOString(), 'YYYY-MM-DD').isValid()) {
      start.setValue(period[0].toISOString().slice(0, 10));
      end.setValue(period[1].toISOString().slice(0, 10));
    }
  }, [period]);

  React.useEffect(() => {
    const nowDate = new Date();
    end.setValue(nowDate.toISOString().slice(0, 10));
    nowDate.setDate(nowDate.getDate() - 1);
    start.setValue(nowDate.toISOString().slice(0, 10));
  }, []);

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <TextField
          placeholder="YYYY-MM-DD"
          variant="outlined"
          error={startDateError.isError}
          helperText={startDateError.helperText}
          value={start.value}
          onChange={start.handleChangeISODateNumber}
          inputProps={{
            maxLength: 10,
            style: {
              textAlign: 'center',
              fontFamily: 'AppleSDGothicNeo',
              fontSize: '20px',
              fontWeight: 440,
              backgroundColor: '#ffff'
            }
          }}
          className={classnames({
            [classes.textField]: true,
            [classes.base]: base,
            [classes.compare]: !base
          })}
        />
      </Grid>
      <Grid item style={{ height: '100%', }}>
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
          onChange={end.handleChangeISODateNumber}
          inputProps={{
            maxLength: 10,
            style: {
              textAlign: 'center',
              fontFamily: 'AppleSDGothicNeo',
              fontSize: '20px',
              fontWeight: 440,
              backgroundColor: '#ffff',
            }
          }}
          className={classnames({
            [classes.textField]: true,
            [classes.base]: base,
            [classes.compare]: !base
          })}
        />
      </Grid>
    </Grid>
  );
}
