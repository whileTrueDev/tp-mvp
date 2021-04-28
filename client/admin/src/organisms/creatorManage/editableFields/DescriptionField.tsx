import { TextField } from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import ShowSnack from '../../snackbar/ShowSnack';

import EditableFieldBase from './EditableFieldBase';

interface DescriptionFieldProps {
  description?: string;
  creator: User
  onSuccess: () => void;
}

export default function DescriptionField({
  description,
  creator,
  onSuccess,
}: DescriptionFieldProps): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const [{ loading }, request] = useAxios({ url: 'users', method: 'patch' }, { manual: true });

  const [desc, setDesc] = useState<string>(description || '');
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDesc(e.target.value);
  }
  function handleSubmit() {
    const data: Partial<UpdateUserDto> = {
      userId: creator.userId,
      description: desc,
      detailId: creator.detail?.id,
    };
    request({ data })
      .then(() => {
        ShowSnack('방송인 설명 변경 성공', 'success', enqueueSnackbar);
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        ShowSnack('방송인 설명 변경 실패', 'error', enqueueSnackbar);
        console.error('방송인 설명 변경 실패 - ', err);
      });
  }
  return (
    <EditableFieldBase
      onSubmit={handleSubmit}
      name="방송인설명"
      buttonLoading={loading}
      displayValue={description || '없음'}
      field={(
        <TextField
          value={desc}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}
