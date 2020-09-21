import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Grid, FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText, Typography,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { PerioudCompareCheckBoxGroupProps } from './PerioudCompareHero.interface';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginTop: '37px'
  },
  formGroup: {
    flexDirection: 'row',
    justifyContent: 'left',
  },
  formLabel: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1,
    textAlign: 'center',
    color: '#4d4f5c',
    marginRight: '55px'
  },
  checkBox: {
    color: '#3b86ff'
  },
  checkBoxIcons: {
    fontSize: '30px',
    color: '#3b86ff'
  }
}),);

export default function PerioudCompareCheckBoxGroup(
  props: PerioudCompareCheckBoxGroupProps
): JSX.Element {
  const {
    viewer, smileCount, chatCount, handleCheckStateChange
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FormControl component="fieldset">
        <FormGroup className={classes.formGroup}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={viewer}
                onChange={handleCheckStateChange}
                name="viewer"
                checkedIcon={<CheckBoxIcon className={classes.checkBoxIcons} />}
                icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxIcons} />}
                className={classes.checkBox}
              />
            )}
            label={(
              <Typography className={classes.formLabel}>
                평균 시청자수(시간당)
              </Typography>
          )}
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={chatCount}
                onChange={handleCheckStateChange}
                name="chatCount"
                size="medium"
                checkedIcon={<CheckBoxIcon className={classes.checkBoxIcons} />}
                icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxIcons} />}
                className={classes.checkBox}
              />
            )}
            style={{ fontSize: '30px' }}
            label={(
              <Typography className={classes.formLabel}>
                채팅 발생수
              </Typography>
          )}
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={smileCount}
                onChange={handleCheckStateChange}
                name="smileCount"
                checkedIcon={<CheckBoxIcon className={classes.checkBoxIcons} />}
                icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxIcons} />}
                className={classes.checkBox}
              />
            )}
            label={(
              <Typography className={classes.formLabel}>
                웃음 발생수
              </Typography>
          )}
          />
        </FormGroup>
      </FormControl>
    </div>
  );
}
