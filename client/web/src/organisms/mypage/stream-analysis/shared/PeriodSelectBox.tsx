import React from 'react';
import {
  Box, Typography, TextField,
} from '@material-ui/core';

import {
  makeStyles, Theme, createStyles,
} from '@material-ui/core/styles';
import classnames from 'classnames';
// date library
import moment from 'moment';
// interfaces
import { PeriodSelectBoxProps } from './StreamAnalysisShared.interface';

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    width: '474px',
    height: 'auto',
  },
  title: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '22px',
    fontFamily: 'AppleSDGothicNeo',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  periodTextFieldWrapper: {
    display: 'flex',
    flex: 1,
    padding: theme.spacing(2),
    width: '100%',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
  textField: {
    width: '153px',
    textAlign: 'center',
  },
  textFieldIntput: {
    color: theme.palette.text.secondary,
    fontSize: '18px',
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
    height: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  boxBorderSelected: {
    borderRadius: 16,
    borderColor: '#707070',
    border: '1px solid',
  },
  boxBorderNotSelected: {
    borderColor: theme.palette.action.selected,
    borderStyle: 'dashed',
    borderRadius: 16,
  },
}));

export default function PeriodSelectBox(props: PeriodSelectBoxProps): JSX.Element {
  const {
    targetRef, period, TitleIcon, iconProps, titleMessage,
  } = props;
  const classes = useStyles();
  const now = new Date();

  return (
    <div ref={targetRef}>
      <Box
        className={classnames({
          [classes.box]: true,
          [classes.boxBorderSelected]: period[0] && period[1],
          [classes.boxBorderNotSelected]: !(period[0] && period[1]),
        })}
      >

        <Typography className={classes.title}>
          <TitleIcon className={classes.icon} style={{ ...iconProps }} />
          {titleMessage}
        </Typography>

        <div className={classes.periodTextFieldWrapper}>

          <TextField
            className={classes.textField}
            placeholder={moment(now).subtract(1, 'day').format('YYYY년MM월DD일')}
            inputProps={{ style: { textAlign: 'center' }, className: classes.textFieldIntput }}
            value={period[0]
              ? moment(period[0]).format('YYYY년MM월DD일')
              : ''}
          />
          <Typography>~</Typography>
          <TextField
            className={classes.textField}
            placeholder={moment(now).format('YYYY년MM월DD일')}
            inputProps={{ style: { textAlign: 'center' }, className: classes.textFieldIntput }}
            value={period[1]
              ? moment(period[1]).format('YYYY년MM월DD일')
              : ''}
          />

        </div>

      </Box>
    </div>

  );
}
