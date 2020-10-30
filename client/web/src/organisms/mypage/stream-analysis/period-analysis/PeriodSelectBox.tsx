import React from 'react';
import {
  Box, Typography, TextField,
} from '@material-ui/core';

import {
  makeStyles, Theme, createStyles,
} from '@material-ui/core/styles';

import moment from 'moment';
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    width: '474px',
    height: '110px',

  },
  title: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '18px',
    fontFamily: 'SourceSansPro',
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  periodTextFieldWrapper: {
    display: 'flex',
    flex: 1,
    padding: theme.spacing(2),
    width: '100%',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  textField: {
    width: '153px',
    textAlign: 'center',
  },
  iconButton: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: '28px',
  },
  box: {
    width: '474px',
    height: '110px',
    backgroundColor: theme.palette.background.paper,
  },
}));

export interface PeriodSelectBoxProps {
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
}

export default function PeriodSelectBox(props: PeriodSelectBoxProps): JSX.Element {
  const {
    targetRef,
  } = props;
  const classes = useStyles();
  const now = new Date();

  return (
    <div ref={targetRef}>
      <Box
        borderRadius={16}
        borderColor="#707070"
        border={1}
        className={classes.box}
      >
        <Typography className={classes.title}>
          <SelectDateIcon className={classes.icon} />
          기간 선택
        </Typography>

        <div className={classes.periodTextFieldWrapper}>

          <TextField
            className={classes.textField}
            defaultValue={moment(now).subtract(1, 'day').format('YYYY년MM월DD일')}
            inputProps={{ style: { textAlign: 'center' } }}
          />
          <Typography>~</Typography>
          <TextField
            className={classes.textField}
            defaultValue={moment(now).format('YYYY년MM월DD일')}
            inputProps={{ style: { textAlign: 'center' } }}
          />

        </div>

      </Box>
    </div>

  );
}
