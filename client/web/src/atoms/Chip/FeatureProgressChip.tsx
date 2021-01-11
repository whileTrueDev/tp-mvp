import { Chip, useTheme } from '@material-ui/core';
import React from 'react';

// 기능제안 상태 Chip 렌더링을 위해
export const FeatureProgressChip = (value: number): React.ReactNode => {
  const theme = useTheme();
  switch (value) {
    case 1: return (<Chip style={{ margin: 4, color: theme.palette.common.black, borderColor: 'rgba(0, 0, 0, 0.23)' }} color="secondary" label="검토중" />);
    case 2: return (<Chip style={{ margin: 4, borderColor: 'rgba(0, 0, 0, 0.23)' }} color="primary" label="개발확정" />);
    case 3: return (
      <Chip
        style={{
          margin: 4, borderColor: 'rgba(0, 0, 0, 0.23)', backgroundColor: theme.palette.error.light,
        }}
        label="개발보류"
      />
    );
    default: return (<Chip style={{ margin: 4, borderColor: 'rgba(0, 0, 0, 0.23)' }} variant="outlined" label="미확인" />);
  }
};
