import { ListItem, Typography, useTheme } from '@material-ui/core';
import React from 'react';

function ColumnHeader({ columns }: {
  columns: Record<string, any>[]
 }): JSX.Element {
  const theme = useTheme();
  return (
    <ListItem
      component="div"
      style={{
        display: 'flex',
        backgroundColor: theme.palette.primary.main,
      }}
    >
      {columns.map((col) => (
        <Typography
          style={{
            width: col.width,
            textAlign: 'center',
            color: theme.palette.primary.contrastText,
            whiteSpace: 'pre-line',
            wordBreak: 'keep-all',
            margin: theme.spacing(1),
          }}
          key={col.key}
        >
          {col.title}
        </Typography>
      ))}
    </ListItem>
  );
}

export default ColumnHeader;
