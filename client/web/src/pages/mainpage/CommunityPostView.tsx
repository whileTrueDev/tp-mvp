import React, { useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { CommunityPost } from '@truepoint/shared/dist/interfaces/CommunityPost.interface';
import * as dateFns from 'date-fns';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';
import CenterLoading from '../../atoms/Loading/CenterLoading';
import PostInfoCard from '../../organisms/mainpage/communityBoard/postView/PostInfoCard';
import 'suneditor/dist/css/suneditor.min.css'; // suneditor로 작성된 컨텐츠를 표시하기 위해 필요함

function isOldPost(createDate: string) {
  const hourDiff = dateFns.differenceInHours(new Date(createDate), new Date());
  // console.log(hourDiff);
  return hourDiff > 24;
}
const useStyles = makeStyles((theme: Theme) => createStyles({
  boardTitle: {},
  headerCard: {},
  viewer: {},
  recommendContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendCard: {
    display: 'flex',
  },
  buttons: {},
  replyContainer: {},
}));

interface LocationState{
  platform: 'afreeca'|'twitch';
}

const SUN_EDITOR_VIEWER_CLASSNAME = 'sun-editor-editable';

export default function CommunityPostView(): JSX.Element {
  const classes = useStyles();
  const { postId } = useParams<any>();
  const location = useLocation<LocationState>();
  const platform = location.state ? location.state.platform : undefined;
  const viewerRef = useRef<any>(); // 컨텐츠를 표시할 element
  const [{ data: currentPost }, getPostForView] = useAxios<CommunityPost>({ url: `/community/posts/${postId}` }, { manual: true });
  const [{ data: recommendCount }, postRecommend] = useAxios({ url: `/community/posts/${postId}/recommend`, method: 'post' }, { manual: true });
  // const [recommendCount, setRecommendCount] = useState<number>(); // 현재 글의 추천수를 저장

  useEffect(() => {
    // postId로 글 내용 불러오기
    getPostForView().then((res) => {
      // console.log(res);
      if (viewerRef && viewerRef.current) {
        viewerRef.current.innerHTML = res.data.content;
      }
    }).catch((e) => {
      console.error(e);
    });
  }, []);

  const handleRecommend = () => {
    // 동일 글은 하루 한번만 추천하기
    /**
     * 로컬스토리지 recommendList를 JSON.parse로 가져와서
     * 하루가 지난 추천글을 filter로 걸러낸다
     * 남은 목록 중 현재 글과 같은 id가 있으면 하루 한번만 추천가능 에러스낵바
     * recommendList가 없거나, 남은 목록 중 현재 글과 같은 id가 없으면 
     * 로컬스토리지 recommendedPost 에 {id: postId, date: new Date()}를 저장한다 JSON.stringify
     * 그리고 요청
     */
    const recommendList: {id: string, date: string}[] = JSON.parse(localStorage.getItem('recommendList') || '[]');
    const filteredList = recommendList.filter((item) => isOldPost(item.date));
    const filteredId = filteredList.map((item) => item.id);
    // console.log({ filteredList, filteredId, id: currentPost?.postId });

    if (currentPost && filteredId.includes(currentPost.postId.toString())) {
      alert('동일한 글은 하루에 한 번만 추천 할 수 있습니다');
      return;
    }

    // 해당 글 추천하기 요청
    postRecommend()
      .then((res) => {
        // console.log(res);
        localStorage.setItem('recommendList', JSON.stringify([...filteredList, { id: currentPost?.postId, date: new Date() }]));
      })
      .catch((err) => {
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요...');
        console.error(err);
      // 에러스낵바
      });
  };

  return (
    <CommunityBoardCommonLayout>
      <Container maxWidth="md">

        <BoardTitle platform={platform} />

        {currentPost ? (
          <>
            <PostInfoCard post={currentPost} />
          </>
        ) : (
          <CenterLoading />
        )}

        <div className={classes.viewer}>
          <div ref={viewerRef} className={SUN_EDITOR_VIEWER_CLASSNAME} />
          <div className={classes.recommendContainer}>
            <Card className={classes.recommendCard}>
              <CardContent>
                <Typography>{`추천 ${recommendCount || currentPost?.recommend || 0}`}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={handleRecommend} variant="contained" color="primary">
                  추천
                </Button>
              </CardActions>
            </Card>
          </div>
        </div>

        <div className={classes.buttons}>
          추천버튼 가운데(추천시 숫자만 올라가고 글을 새로 불러오지는 않음) | 오른쪽에 수정, 삭제버튼
        </div>

        <div className={classes.replyContainer}>
          {/** 댓글부분은 별도 컴포넌트 */}
          <div>전체댓글, 댓글 등록순/최신순 필터 | 본문보기, 댓글닫기, 새로고침버튼</div>
          <div>
            작성자(ㅑ아이피)   댓글내용    시간 목록
            <button>x</button>
          </div>
          <div>댓글 페이지네이션</div>
          <div>!댓글작성폼!</div>
        </div>
      </Container>

    </CommunityBoardCommonLayout>
  );
}
