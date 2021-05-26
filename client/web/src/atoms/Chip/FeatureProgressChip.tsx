import { Chip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import React from 'react';
import useMediaSize from '../../utils/hooks/useMediaSize';

const useChipStyle = makeStyles((theme: Theme) => createStyles({
  common: {
    margin: theme.spacing(0.5),
    borderColor: 'rgba(0, 0, 0, 0.23)',
    fontSize: theme.typography.body1.fontSize,
    borderRadius: theme.spacing(1),
  },
  default: {
    color: theme.palette.common.black,
  },
  hold: {
    backgroundColor: theme.palette.error.light,
  },
}));

// 기능제안 상태 Chip 렌더링을 위해
export const FeatureProgressChip = (value: number): React.ReactNode => {
  const classes = useChipStyle();
  const { isMobile } = useMediaSize();

  switch (value) {
    case 1: return (
      <Chip
        size={isMobile ? 'small' : undefined}
        className={classnames(classes.common)}
        color="primary"
        variant="outlined"
        label="검토중"
      />
    );
    case 2: return (
      <Chip
        size={isMobile ? 'small' : undefined}
        className={classnames(classes.common)}
        color="primary"
        label="개발확정"
      />
    );
    case 3: return (
      <Chip
        size={isMobile ? 'small' : undefined}
        className={classnames(classes.common, classes.hold)}
        label="개발보류"
      />
    );
    default: return (
      <Chip
        size={isMobile ? 'small' : undefined}
        className={classnames(classes.common, classes.default)}
        variant="outlined"
        label="미확인"
      />
    );
  }
};
