import { TextField } from '@material-ui/core';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import ShowSnack from '../../snackbar/ShowSnack';
import EditableFieldBase from './EditableFieldBase';

interface YoutubeAddressFieldProps {
  youtubeAddress?: string;
  creator: User;
  onSuccess: () => void;
}

export default function YoutubeAddressField({
  youtubeAddress,
  creator,
  onSuccess,
}: YoutubeAddressFieldProps): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const [{ loading }, request] = useAxios({ url: 'users', method: 'patch' }, { manual: true });

  const [channelAddress, setChannelAddress] = useState<string>(youtubeAddress || '');
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChannelAddress(e.target.value);
  }
  function handleSubmit() {
    const data: Partial<UpdateUserDto> = {
      youtubeChannelAddress: channelAddress,
      userId: creator.userId,
      detailId: creator.detail?.id,
    };
    request({ data })
      .then((res) => {
        ShowSnack('방송인 유튜브 채널 주소 변경 성공', 'success', enqueueSnackbar);
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        ShowSnack('방송인 유튜브 채널 주소 변경 실패', 'error', enqueueSnackbar);
        console.error('방송인 유튜브 채널 주소 변경 실패 - ', err);
      });
  }
  return (
    <EditableFieldBase
      onSubmit={handleSubmit}
      buttonLoading={loading}
      name="방송인 유튜브 채널 주소"
      displayValue={youtubeAddress || '없음'}
      field={
        <TextField variant="outlined" fullWidth value={channelAddress} onChange={handleChange} />
      }
    />
  );
}
