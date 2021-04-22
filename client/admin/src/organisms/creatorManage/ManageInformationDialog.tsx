import {
  Avatar,
  Box, Dialog, Divider, makeStyles, Typography,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useMemo } from 'react';
import CategoryChip from '../../atoms/CategoryChip';
import CategoryField from './editableFields/CategoryField';
import DescriptionField from './editableFields/DescriptionField';
import HeroImageField from './editableFields/HeroImageField';
import YoutubeAddressField from './editableFields/YoutubeAddressField';

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));
interface ManageInformationDialogProps {
  open: boolean;
  onClose: () => void;
  creator: User;
  reload: () => void;
}

export default function ManageInformationDialog({
  open,
  onClose,
  creator,
  reload,
}: ManageInformationDialogProps): React.ReactElement {
  const clases = useStyles(0);

  const categories = useMemo(() => (
    <>
      {creator.afreeca?.categories?.map((x) => <CategoryChip size="small" label={x.name} key={x.categoryId} />)}
      {creator.twitch?.categories?.map((x) => <CategoryChip size="small" label={x.name} key={x.categoryId} />)}
    </>
  ), [creator.afreeca, creator.twitch]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <Box padding={2}>
        <Typography variant="h6">
          유저 정보 변경 및 관리
        </Typography>
      </Box>

      <Divider />

      <Box display="flex" padding={2}>
        <Avatar
          className={clases.avatar}
          style={{ marginRight: 8 }}
          src={creator.afreeca?.logo || creator.twitch?.logo}
        >
          {creator.twitch ? (<img style={{ marginRight: 4 }} alt="twitch" width={20} height={20} src="/logos/twitchLogo.png" />) : (null)}
          {creator.afreeca ? (<img style={{ marginRight: 4 }} alt="afreeca" width={20} height={20} src="/logos/afreecaLogo.png" />) : (null)}
          {creator.youtube ? (<img style={{ marginRight: 4 }} alt="youtube" width={20} height={20} src="/logos/youtubeLogo.png" />) : (null)}
        </Avatar>
        <Box>
          {categories}
          <Typography>{`${creator.nickName} • ${creator.userId}`}</Typography>
          <Typography variant="body2" color="textSecondary">{`${dayjs(creator.createdAt).fromNow()} 추가`}</Typography>
        </Box>
      </Box>

      <Box padding={2}>
        <CategoryField
          displayValue={categories}
          creator={creator}
          onSuccess={() => {
            reload();
            onClose();
          }}
        />
        <DescriptionField
          description={creator.detail?.description || '없음'}
          creator={creator}
          onSuccess={() => {
            reload();
            onClose();
          }}
        />
        <YoutubeAddressField
          youtubeAddress={creator.detail?.youtubeChannelAddress || '없음'}
          creator={creator}
          onSuccess={() => {
            reload();
            onClose();
          }}
        />
        <HeroImageField
          heroImage={creator.detail?.heroImageDark}
          creator={creator}
          onSuccess={() => {
            reload();
            onClose();
          }}
        />
        {/* <Typography color="error">다른 플랫폼 연동 추가</Typography> */}
      </Box>
    </Dialog>
  );
}
