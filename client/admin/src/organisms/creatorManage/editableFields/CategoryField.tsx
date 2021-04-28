import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AddCreatorToCategoryDto } from '@truepoint/shared/dist/dto/category/addCreatorToCategoryPost.dto';
import { CreatorCategory } from '@truepoint/shared/dist/interfaces/CreatorCategory.interface';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React from 'react';
import ShowSnack from '../../snackbar/ShowSnack';
import EditableFieldBase from './EditableFieldBase';

interface CategoryFieldProps {
  displayValue: string | React.ReactElement;
  creator: User;
  onSuccess?: () => void;
}

export default function CategoryField({
  displayValue,
  creator,
  onSuccess,
}: CategoryFieldProps): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const [{ data, loading }] = useAxios<CreatorCategory[]>({ url: '/creator-category', method: 'get' });

  const [{ loading: buttonLoading }, addCategory] = useAxios({
    url: '/creator-category/creator', method: 'post',
  }, { manual: true });

  const [selectedCategory, setSelectedCategory] = React.useState<CreatorCategory | null>(null);
  function onChange(e: any, newV: CreatorCategory | null) {
    setSelectedCategory(newV);
  }

  function handleSubmit() {
    const _data: Partial<AddCreatorToCategoryDto> = {};
    _data.categoryId = selectedCategory?.categoryId;
    if (creator.afreeca) {
      _data.platform = 'afreeca';
      _data.creatorId = creator.afreeca.afreecaId;
    }
    if (creator.twitch) {
      _data.platform = 'twitch';
      _data.creatorId = creator.twitch.twitchId;
    }
    addCategory({ data: { ..._data } })
      .then(() => {
        ShowSnack('카테고리 변경 완료!', 'success', enqueueSnackbar);
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        ShowSnack('카테고리 변경 실패', 'error', enqueueSnackbar);
        console.error('카테고리 변경 실패 - ', err);
      });
  }

  return (
    <EditableFieldBase
      name="카테고리 분류"
      displayValue={displayValue}
      buttonLoading={buttonLoading}
      onSubmit={handleSubmit}
      field={(
        <Autocomplete
          loading={loading}
          options={data || []}
          value={selectedCategory}
          onChange={onChange}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
        />
        )}
    />
  );
}
