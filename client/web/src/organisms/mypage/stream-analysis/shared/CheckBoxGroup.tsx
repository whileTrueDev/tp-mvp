import React from 'react';
// styles
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
// material-ui core components
import {
  FormControl, FormGroup, FormControlLabel, Typography, Checkbox,
} from '@material-ui/core';
// material-ui icons
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// interfaces
import { CheckBoxGroupProps } from './StreamAnalysisShared.interface';

const useStyles = makeStyles((theme: Theme) => createStyles({
  formGroup: {
    flexDirection: 'row',
    justifyContent: 'left',
  },
  formLabel: {

    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(7),
  },
  checkBoxIcons: { color: '#3b86ff' },
}));

export default function CheckBoxGroup(
  props: CheckBoxGroupProps,
): JSX.Element {
  const {
    viewer, smile, chat, handleCheckStateChange,
  } = props;
  const classes = useStyles();

  return (
    <div>
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
                checked={chat}
                onChange={handleCheckStateChange}
                name="chat"
                size="medium"
                checkedIcon={<CheckBoxIcon className={classes.checkBoxIcons} />}
                icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxIcons} />}
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
                checked={smile}
                onChange={handleCheckStateChange}
                name="smile"
                checkedIcon={<CheckBoxIcon className={classes.checkBoxIcons} />}
                icon={<CheckBoxOutlineBlankIcon className={classes.checkBoxIcons} />}
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
