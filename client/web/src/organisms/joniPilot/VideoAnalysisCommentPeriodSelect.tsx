import React, { useState, memo } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useVideoAnalysisCommentsStyles = makeStyles((theme: Theme) => createStyles({
  selectInputContainer: {
    textAlign: 'right',
  },
  selectInput: {
    padding: theme.spacing(1, 2),
  },
}));

interface PropsType extends Record<string, any>{
  onSelect: () => void
}
export default memo((props: PropsType): JSX.Element => {
  const classes = useVideoAnalysisCommentsStyles();
  const [period, setPeriod] = useState<number>(3);
  const { onSelect } = props;

  const handleSelectInputChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setPeriod(event.target.value as number);
    onSelect();
  };

  return (
    <div className={classes.selectInputContainer}>
      <Select
        className={classes.selectInput}
        variant="outlined"
        value={period}
        onChange={handleSelectInputChange}
      >
        <MenuItem value={3}>최근 3일</MenuItem>
        <MenuItem value={7}>최근 7일</MenuItem>
        <MenuItem value={30}>최근 30일</MenuItem>
      </Select>
    </div>
  );
});
