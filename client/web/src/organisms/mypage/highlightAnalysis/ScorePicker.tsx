import React from 'react';
import { makeStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyle = makeStyles((theme) => ({
  wraper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  boundary: {
    border: `2px solid ${theme.palette.primary.main}`,
    paddingRight: theme.spacing(2),
    borderRadius: '10px',
  },
}));

interface ScorePickerProps {
  picked90: boolean
  setPicked90: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ScorePicker(
  { picked90, setPicked90 }: ScorePickerProps,
): JSX.Element {
  const classes = useStyle();

  const handleChange = () => {
    setPicked90(!picked90);
  };

  return (
    <div className={classes.wraper}>
      <FormControlLabel
        className={classes.boundary}
        control={(
          <Switch
            checked={picked90}
            onChange={handleChange}
            color="primary"
          />
        )}
        label="상위 10% 편집점만 보기"
      />
    </div>
  );
}
