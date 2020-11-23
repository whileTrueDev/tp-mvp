import React from 'react';
import { TextField, Button, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';

const useStyles = makeStyles((theme) => ({
  textField: { minWidth: 300 },
  button: { marginLeft: theme.spacing(1) },
}));
export interface EditableInputProps {
  data: string | number;
  id: keyof Omit<UpdateUserDto, 'userId'>;
  onEdit: (field: keyof Omit<UpdateUserDto, 'userId'>, value: string) => Promise<any>;
  helperText?: string;
  type?: string;
}
export default function EditableInput({
  id,
  data,
  onEdit,
  helperText,
  type = 'text',
}: EditableInputProps): JSX.Element {
  const classes = useStyles();

  // ************************************
  // 편집 모드 제어를 위한 스테이트
  const [editMode, setEditMode] = React.useState(false);
  function toggleEditMode() {
    setEditMode((prev) => !prev);
  }

  // ************************************
  // Input value 스테이트
  const [value, setValue] = React.useState<string>('');
  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  // ************************************
  // 변경 핸들러
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onEdit(id, value).then(() => toggleEditMode());
  }

  return (
    <>
      {!editMode ? (
        <>
          <TextField value={data} disabled className={classes.textField} />
          <Button variant="contained" className={classes.button} onClick={toggleEditMode}>
            편집
            <Edit fontSize="small" />
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            id={id}
            required
            type={type}
            autoFocus
            autoComplete="off"
            className={classes.textField}
            helperText={helperText}
            value={value}
            onChange={handleValueChange}
          />
          <Button variant="contained" className={classes.button} onClick={toggleEditMode}>취소</Button>
          <Button
            type="submit"
            variant="contained"
            className={classes.button}
            color="primary"
          >
            변경
          </Button>
        </form>
      )}
    </>
  );
}
