import {
  Avatar,
  Box, Button, CircularProgress, makeStyles, Typography,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import {
  Redirect, useHistory, useParams,
} from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CategoryChip from '../../atoms/CategoryChip';
import CreatorRatingForAdmin from './CreatorRatingForAdmin';
import CategoryField from './editableFields/CategoryField';
import DescriptionField from './editableFields/DescriptionField';
import YoutubeAddressField from './editableFields/YoutubeAddressField';

const useStyles = makeStyles((theme) => ({
  section: {
    position: 'relative',
    paddingTop: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(5),
  },
}));

function CreatorDetail(): React.ReactElement {
  const classes = useStyles();
  const { userId } = useParams<{userId: string}>();
  const history = useHistory();

  const [{ data, loading }, refetch] = useAxios<User>({ url: 'users', method: 'get', params: { userId } });

  const categories = useMemo(() => (
    <>
      {data?.afreeca?.categories?.map((x) => <CategoryChip size="small" label={x.name} key={x.categoryId} />)}
      {data?.twitch?.categories?.map((x) => <CategoryChip size="small" label={x.name} key={x.categoryId} />)}
    </>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [data]);

  if (loading) return <CircularProgress />;
  if (!data) return <Redirect to="/admin/creator" />;
  return (
    <Box>
      <Button variant="contained" onClick={() => history.push('/admin/creator')}>
        돌아가기
      </Button>
      <Box className={classes.section}>
        <Box display="flex" padding={2}>
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
        </Box>

        {data && (
        <CreatorRatingForAdmin
          creatorId={
            (data.afreeca && data.afreeca.afreecaId)
            || (data.twitch && data.twitch.twitchId)
          }
          platform={data.afreeca ? 'afreeca' : 'twitch'}
        />
        )}
      </Box>
    </Box>
  );
}

export default CreatorDetail;
