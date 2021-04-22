import {
  Box, Button, Collapse, Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React from 'react';
import useDialog from '../../../util/hooks/useDialog';

interface EditableFieldBaseProps {
  name: string;
  buttonText?: string;
  buttonLoading?: boolean;
  displayValue: string | React.ReactElement;
  field: React.ReactElement;
  onClick?: () => void;
  onSubmit: () => void;
}

export default function EditableFieldBase({
  name,
  buttonText = '변경',
  buttonLoading = false,
  displayValue,
  field,
  onClick,
  onSubmit,
}: EditableFieldBaseProps): React.ReactElement {
  const collapseOpen = useDialog();
  return (
    <Box mb={2}>
      <Typography style={{ fontWeight: 'bold' }}>{name}</Typography>
      <Box my={0.5}>{displayValue}</Box>

      <Button
        variant="outlined"
        onClick={() => {
          if (!collapseOpen.open) collapseOpen.handleOpen();
          if (collapseOpen.open) collapseOpen.handleClose();
          if (onClick) onClick();
        }}
      >
        편집
        <Edit fontSize="small" />
      </Button>

      <Collapse in={collapseOpen.open}>
        <Box>

          <Box py={1}>{field}</Box>

          <Box display="flex">
            <Button disabled={buttonLoading} onClick={onSubmit} color="primary" variant="contained">
              {buttonText}
            </Button>
            <Box ml={1}>
              <Button onClick={collapseOpen.handleClose} variant="outlined">취소</Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
