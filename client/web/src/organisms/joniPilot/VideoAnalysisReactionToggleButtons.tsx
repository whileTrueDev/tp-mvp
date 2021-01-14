import React, { memo, useCallback } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import {
  Theme, withStyles,
} from '@material-ui/core/styles';

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
  },
  grouped: {
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius * 4,
      border: `1px solid ${theme.palette.divider}`,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius * 4,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}))(ToggleButtonGroup);

const StyledToggleButton = withStyles((theme: Theme) => ({
  root: {
    flex: 1,
    maxWidth: '20%',
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(20),
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.dark,
    },
  },
  label: {
    display: 'block',
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
  },
}))(ToggleButton);

// 버튼 데이터
const buttonData = [
  {
    label: '가장 인기 많은 \n댓글',
    url: '/mostPopularComments',
  },
  {
    label: '가장 인기 많은 \n대댓글',
    url: '/mostPopularReplies',
  },
  {
    label: '웃음이 많은 \n댓글',
    url: '/mostSmiledComments',
  },
  {
    label: '피드백 \n댓글',
    url: '/feedbackComments',
  },
];

interface ToggleButtonsPropType{
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}
export default memo((props: ToggleButtonsPropType): JSX.Element => {
  const { url, setUrl } = props;
  const handleClick = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, newUrl: any) => {
    if (newUrl !== null) {
      setUrl(newUrl);
    }
  }, [setUrl]);
  return (
    <StyledToggleButtonGroup
      value={url}
      exclusive
      onChange={handleClick}
    >
      {buttonData.map((button) => (
        <StyledToggleButton key={button.label} value={button.url}>{button.label}</StyledToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
});
