import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { RecentStream } from '@truepoint/shared/dist/res/RecentStreamResType.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../../../atoms/Button/GoBackButton';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import PageTitle from '../shared/PageTitle';
import StreamCommentList from './streamInfo/StreamCommentList';
import StreamInfoCard from './streamInfo/StreamInfoCard';
import { useCreatorEvalutationCardStyle } from './style/Evaluation.style';

export default function StreamEvaluation(): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useCreatorEvalutationCardStyle();
  const { streamId, creatorId } = useParams<{streamId: string, creatorId: string}>();

  const [{ data: creatorInfo }] = useAxios<User>({ url: '/users', method: 'get', params: { creatorId } });
  const platform = creatorInfo?.afreeca ? 'afreeca' : 'twitch';
  const [{ data: streamData, loading }, refetch] = useAxios<RecentStream>({ url: `broadcast-info/${platform}/${streamId}`, method: 'get' });

  // creatorInfo가 갱신되었을 때 platform이 바뀌므로 다시 불러온다
  useEffect(() => {
    refetch();
  }, [creatorInfo, refetch]);
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
      <PageTitle text="방송 후기 페이지" />
      <StreamInfoCard
        creator={creatorInfo}
        stream={streamData}
        loading={loading}
        onUpVote={() => handleVote('up')}
        onDownVote={() => handleVote('down')}
        onVoteCancel={handleVoteDelete}
      />

      <StreamCommentList streamId={streamId} />
    </div>
  );
}
