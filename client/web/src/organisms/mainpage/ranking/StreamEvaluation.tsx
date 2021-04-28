import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { RecentStream } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import GoBackButton from '../../../atoms/Button/GoBackButton';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import StreamCommentList from './streamInfo/StreamCommentList';
import StreamInfoCard from './streamInfo/StreamInfoCard';
import { useCreatorEvalutationCardStyle } from './style/Evaluation.style';

export default function StreamEvaluation(): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useCreatorEvalutationCardStyle();
  const location = useLocation<User>();
  const { platform, streamId } = useParams<{creatorId: string, platform: 'afreeca'|'twitch', streamId: string}>();
  const creatorInfo = location.state;

  const [{ data: streamData, loading }, refetch] = useAxios<RecentStream>({ url: `broadcast-info/${platform}/${streamId}`, method: 'get' });

  // ****************************************
  // 좋아요 / 싫어요
  const [, vote] = useAxios<number>({ url: 'broadcast-info/vote', method: 'post' }, { manual: true });
  async function handleVote(type: 'up' | 'down') {
    return vote({
      data: {
        streamId, platform, vote: type, id: streamData?.voteHistory?.id,
      },
    }).then(() => refetch())
      .catch((err) => {
        ShowSnack('반응 등록 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error', enqueueSnackbar);
        console.error('broadcast-info vote error - ', err);
        return err;
      });
  }
  // ****************************************
  // 좋아요/싫어요 삭제
  const [, deleteVote] = useAxios({ url: 'broadcast-info/vote', method: 'delete' }, { manual: true });
  async function handleVoteDelete(voteId: number) {
    return deleteVote({ params: { id: voteId } }).then(() => refetch())
      .catch((err) => {
        ShowSnack('반응 제거 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error', enqueueSnackbar);
        console.error('broadcast-info vote error - ', err);
        return err;
      });
  }

  return (
    <div className={classes.creatorEvaluationCardContainer}>
      <GoBackButton />

      {!loading && streamData && (
      <StreamInfoCard
        creator={creatorInfo}
        stream={streamData}
        loading={loading}
        onUpVote={() => handleVote('up')}
        onDownVote={() => handleVote('down')}
        onVoteCancel={handleVoteDelete}
      />
      )}

      <StreamCommentList streamId={streamId} />
    </div>
  );
}
