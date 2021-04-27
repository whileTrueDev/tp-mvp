import {
  Box, Button, Typography, useTheme,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useMemo } from 'react';
import useImageUpload from '../../../util/hooks/useImageUpload';
import ShowSnack from '../../snackbar/ShowSnack';

interface HeroImageFieldProps {
  heroImage?: string;
  creator: User
  onSuccess: () => void;
  onCancel: () => void;
}

export default function HeroImageField({
  heroImage,
  creator,
  onSuccess,
  onCancel,
}: HeroImageFieldProps): React.ReactElement {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // ******************************************************************
  // 이미지 S3 업로드, DB입력
  const [{ loading }, changePicture] = useAxios({
    url: '/users', method: 'patch',
  }, { manual: true });

  const { image, handleImageUpload } = useImageUpload(
    theme.palette.type === 'dark' ? creator.detail?.heroImageDark : creator.detail?.heroImageLight,
  );

  function handleSubmit() {
    if (!image.imageSrc) alert('이미지를 업로드한 이후 변경을 진행하세요');
    changePicture({
      data: {
        userId: creator.userId,
        heroImageDark: theme.palette.type === 'dark' ? image.imageSrc : undefined,
        heroImageLight: theme.palette.type === 'light' ? image.imageSrc : undefined,
        detailId: creator.detail?.id,
      },
    })
      .then(() => {
        ShowSnack('대문이미지 변경 완료!', 'success', enqueueSnackbar);
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        ShowSnack('대문이미지 변경 실패', 'error', enqueueSnackbar);
        console.error('대문이미지 변경 실패 - ', err);
      });
  }

  const renderImage = useMemo(() => (!image.imageSrc ? ('이미지없음') : (
    <Box py={1}>
      <Typography align="center" variant="h6" color="error">{theme.palette.type === 'dark' ? '현재 다크모드' : '현재 라이트모드'}</Typography>
      <img src={image.imageSrc as string} alt="" height={600 - 16} />
    </Box>
  )), [image.imageSrc, theme.palette.type]);

  return (
    <Box>
      <Typography style={{ fontWeight: 'bold' }}>대문이미지</Typography>

      {renderImage}

      <Box py={1}>
        <Button variant="outlined" color="primary">
          <label htmlFor="hero-image-file">
            <input id="hero-image-file" type="file" accept="image/*" onChange={handleImageUpload} />
            이미지 업로드
          </label>
        </Button>
      </Box>

      <Box py={1}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} color="primary">
          변경
        </Button>
        <Button variant="contained" onClick={onCancel}>
          닫기
        </Button>
      </Box>
    </Box>
  );
}
