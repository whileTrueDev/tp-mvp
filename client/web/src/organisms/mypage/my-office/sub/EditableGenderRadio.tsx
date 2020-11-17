import React from 'react';
import {
  Button, TextField, Radio,
  RadioGroup, FormControlLabel, FormControl, makeStyles,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';

const useStyles = makeStyles((theme) => ({
  textField: { minWidth: 300 },
  button: { marginLeft: theme.spacing(1) },
}));
export interface EditableRadioProps {
  data: string;
  id: keyof Omit<UpdateUserDto, 'userId'>;
  onEdit: (field: keyof Omit<UpdateUserDto, 'userId'>, value: string) => Promise<any>;
}
export default function EditableRadio({
  data, id, onEdit,
}: EditableRadioProps): JSX.Element {
  const classes = useStyles();

  // ************************************
  // 편집 모드 제어를 위한 스테이트
  const [editMode, setEditMode] = React.useState(false);
  function toggleEditMode() {
    setEditMode((prev) => !prev);
  }

  // ************************************
  // 성별 값
  const [value, setValue] = React.useState(data);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  // ************************************
  // 성별 유저가 알아볼 수 있도록 렌더링
  function renderGender(gender: string): string {
    if (gender === 'm') return '남성';
    if (gender === 'f') return '여성';
    return '기타';
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!(value === data)) {
      onEdit(id, value)
        .then(() => toggleEditMode());
    } else {
      toggleEditMode();
    }
  }

  return (
    <>
      {!editMode ? (
        <>
          <TextField value={renderGender(data)} disabled className={classes.textField} />
          <Button variant="contained" className={classes.button} onClick={toggleEditMode}>
            편집
            <Edit fontSize="small" />
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" className={classes.textField}>
            <RadioGroup aria-label={id} name={id} value={value} onChange={handleChange}>
              <FormControlLabel value="f" control={<Radio color="primary" />} label="여성" />
              <FormControlLabel value="m" control={<Radio color="primary" />} label="남성" />
              <FormControlLabel value="other" control={<Radio color="primary" />} label="기타" />
            </RadioGroup>
          </FormControl>
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
