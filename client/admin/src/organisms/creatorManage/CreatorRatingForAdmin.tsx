import {
  Typography, TextField, Grid, Button, Box,
} from '@material-ui/core';
import React, { useRef } from 'react';
import dayjs from 'dayjs';
import useAxios from 'axios-hooks';
import shortid from 'shortid';
import { useSnackbar } from 'notistack';
import ShowSnack from '../snackbar/ShowSnack';

export interface CreatorRatingForAdminProps {
 creatorId: string | undefined;
 platform: 'afreeca' | 'twitch';
}

export default function CreatorRatingForAdmin(props: CreatorRatingForAdminProps): JSX.Element {
  const { creatorId, platform } = props;
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef<HTMLFormElement|null>(null);

  const [{ data: creatorRatingInfo }, getRating] = useAxios(`/ratings/${creatorId}/average`);
  const [, createRating] = useAxios({
    url: '/ratings/admin',
    method: 'post',
  }, { manual: true });

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  const onClick = () => {
    if (!formRef.current || !creatorId) return;
    const form = formRef.current;
    const { rating, count, date } = form;
    const data = new Array(Number(count.value)).fill(0).map(() => ({
      createDate: date.value,
      userIp: shortid.generate(),
      userId: 'truepointAdmin',
      rating: Number(rating.value),
      creatorId,
      platform,
    }));
    createRating({ data })
      .then((res) => {
        getRating();
        ShowSnack(`${date.value}일자 ${count.value}명 ${rating.value}점 데이터 생성`, 'success', enqueueSnackbar);
      })
      .catch((error) => {
        console.error(error);
        ShowSnack('평점 생성 실패', 'error', enqueueSnackbar);
      });
  };

  return (
    <Box p={2} style={{ maxWidth: 800 }}>
      <Typography variant="h6">평점매기기</Typography>

      {creatorRatingInfo && (
        <Box mb={2}>
          <Typography>
            1달 내 평균 평점 :
            {' '}
            {creatorRatingInfo.average.toFixed(2)}
          </Typography>
          <Typography>
            평가한 인원:
            {' '}
            {creatorRatingInfo.count}
          </Typography>
        </Box>
      )}
      <form ref={formRef} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <TextField
              id="rating"
              label="별점 점수"
              type="number"
              fullWidth
              defaultValue={5}
              inputProps={{
                min: 1,
                max: 10,
              }}
              placeholder="평점을 입력해주세요"
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="count"
              label="인원"
              type="number"
              fullWidth
              defaultValue={1}
              inputProps={{
                min: 1,
                max: 20,
              }}
              placeholder="인원을 입력해주세요"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="date"
              label="날짜"
              type="date"
              defaultValue={dayjs().format('YYYY-MM-DD')}
              inputProps={{
                max: dayjs().format('YYYY-MM-DD'),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" type="submit" onClick={onClick}>평점 생성하기</Button>
          </Grid>
        </Grid>
      </form>

    </Box>
  );
}
