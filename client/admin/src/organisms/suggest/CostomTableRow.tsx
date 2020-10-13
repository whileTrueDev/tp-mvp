import React from 'react';
import {
  TableRow, TableCell, TableBody,
} from '@material-ui/core';

interface costomTableProps {
  title: string;
  data?: string;
}
function CostomTableRow(props: costomTableProps): JSX.Element {
  const { title, data } = props;

  return (
    <TableBody>
      <TableRow>
        <TableCell>
          {title}
        </TableCell>
        <TableCell>
          {data}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export default CostomTableRow;
