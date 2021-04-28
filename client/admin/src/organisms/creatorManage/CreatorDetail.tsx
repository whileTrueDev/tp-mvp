import {
  Avatar,
  Box, Button, CircularProgress, Dialog, makeStyles, Typography, useMediaQuery, useTheme,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import {
  Redirect, useHistory, useParams,
} from 'react-router-dom';
import CategoryChip from '../../atoms/CategoryChip';
import useDialog from '../../util/hooks/useDialog';
import CategoryField from './editableFields/CategoryField';
import DescriptionField from './editableFields/DescriptionField';
import HeroImageField from './editableFields/HeroImageField';
import YoutubeAddressField from './editableFields/YoutubeAddressField';

const useStyles = makeStyles((theme) => ({
  section: {
    height: 600,
    position: 'relative',
    paddingTop: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(5),
  },
}));

function CreatorDetail(): React.ReactElement {
  const classes = useStyles();
  const { userId } = useParams<{userId: string}>();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const dialog = useDialog();
  const history = useHistory();

  const [{ data, loading }, refetch] = useAxios<User>({ url: 'users', method: 'get', params: { userId } });

  const categories = useMemo(() => (
    <>
      {data?.afreeca?.categories?.map((x) => <CategoryChip size="small" label={x.name} key={x.categoryId} />)}
      {data?.twitch?.categories?.map((x) => <CategoryChip size="small" label={x.name} key={x.categoryId} />)}
    </>
  ), [data]);

  const currentImage = useMemo(() => (
    theme.palette.type === 'light' ? data?.detail?.heroImageLight : data?.detail?.heroImageDark
  ), [data, theme.palette.type]);

  if (loading) return <CircularProgress />;
  if (!data) return <Redirect to="/admin/creator" />;
  return (
    <Box>
      <Button variant="contained" onClick={() => history.push('/admin/creator')}>
        돌아가기
      </Button>
      <Box className={classes.section}>
        <Box display="flex" padding={2}>
          {!isSmDown && (
          <img
            draggable={false}
            style={{
              position: 'absolute', right: 0, top: 0, height: 600 - 16,
            }}
            src={currentImage}
            alt=""
          />
          )}
          <Box position="absolute" right={8} top={8}>
            <Button variant="contained" color="primary" onClick={dialog.handleOpen}>
              대문 이미지 편집
              <Edit fontSize="small" />
            </Button>
          </Box>
          <Avatar
            // className={clases.avatar}
            style={{ marginRight: 8 }}
            src={data.afreeca?.logo || data.twitch?.logo}
          >
            {data.twitch ? (<img style={{ marginRight: 4 }} alt="twitch" width={20} height={20} src="/logos/twitchLogo.png" />) : (null)}
            {data.afreeca ? (<img style={{ marginRight: 4 }} alt="afreeca" width={20} height={20} src="/logos/afreecaLogo.png" />) : (null)}
            {data.youtube ? (<img style={{ marginRight: 4 }} alt="youtube" width={20} height={20} src="/logos/youtubeLogo.png" />) : (null)}
          </Avatar>
          <Box>
            {categories}
            <Typography>{`${data.nickName} • ${data.userId}`}</Typography>
            <Typography variant="body2" color="textSecondary">{`${dayjs(data.createdAt).fromNow()} 추가`}</Typography>
          </Box>
        </Box>

        <Box padding={2} maxWidth="300px">
          <CategoryField
            displayValue={categories}
            creator={data}
            onSuccess={() => {
              refetch();
            }}
          />
          <DescriptionField
            description={data.detail?.description}
            creator={data}
            onSuccess={() => {
              refetch();
            }}
          />
          <YoutubeAddressField
            youtubeAddress={data.detail?.youtubeChannelAddress}
            creator={data}
            onSuccess={() => {
              refetch();
            }}
          />
          <Dialog open={dialog.open} onClose={dialog.handleClose} maxWidth="xl">
            <Box p={2}>
              <HeroImageField
                heroImage={currentImage}
                creator={data}
                onSuccess={() => {
                  refetch();
                }}
                onCancel={dialog.handleClose}
              />
            </Box>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}

export default CreatorDetail;
