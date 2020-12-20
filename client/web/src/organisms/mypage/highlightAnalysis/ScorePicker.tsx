import React from 'react';
import { makeStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { InitialPoint, initialPoint } from './TruepointHighlight';

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
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setPageSize?: React.Dispatch<React.SetStateAction<number>>
  setPoint?: React.Dispatch<React.SetStateAction<InitialPoint>>
  setPage2?: React.Dispatch<React.SetStateAction<number>>
  setPageSize2?: React.Dispatch<React.SetStateAction<number>>
  setPoint2?: React.Dispatch<React.SetStateAction<InitialPoint>>
  setPage3?: React.Dispatch<React.SetStateAction<number>>
  setPageSize3?: React.Dispatch<React.SetStateAction<number>>
  setPoint3?: React.Dispatch<React.SetStateAction<InitialPoint>>
}

export default function ScorePicker(
  {
    picked90,
    setPicked90,
    setPage,
    setPageSize,
    setPoint,
    setPage2,
    setPageSize2,
    setPoint2,
    setPage3,
    setPageSize3,
    setPoint3,
  }: ScorePickerProps,
): JSX.Element {
  const classes = useStyle();

  const handleChange = () => {
    setPicked90(!picked90);

    if (setPage && setPageSize && setPoint) {
      setPage(0);
      setPageSize(5);
      setPoint(initialPoint);
    }

    if (setPage2 && setPageSize2 && setPoint2) {
      setPage2(0);
      setPageSize2(5);
      setPoint2(initialPoint);
    }

    if (setPage3 && setPageSize3 && setPoint3) {
      setPage3(0);
      setPageSize3(5);
      setPoint3(initialPoint);
    }
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
