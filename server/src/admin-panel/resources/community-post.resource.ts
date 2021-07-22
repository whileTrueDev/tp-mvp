import AdminBro, { ResourceWithOptions } from 'admin-bro';
import { CommunityPostEntity } from '../../resources/communityBoard/entities/community-post.entity';
import { CREATE_DATE__DESC, showOnly } from '../config';

const PLATFORM_LABEL = AdminBro.bundle('../components/community-post-platform-label.tsx');
const CATEGORY_LABEL = AdminBro.bundle('../components/community-post-category-label.tsx');
const LINK = AdminBro.bundle('../components/community-post-link.tsx');
const CREATE_COMMENT_FOR_POST = AdminBro.bundle('../components/comment-for-post');

const CommunityPostResource: ResourceWithOptions = {
  resource: CommunityPostEntity,
  options: {
    listProperties: [
      'postId',
      'title',
      'createDate',
      'platform',
      'category',
      'recommend',
      'notRecommendCount',
      'nickname',
      'content',
    ],
    sort: CREATE_DATE__DESC,
    properties: {
      postId: { isId: true },
      title: { isTitle: true },
      content: { type: 'richtext', position: 1 },
      platform: {
        components: {
          list: PLATFORM_LABEL,
          show: PLATFORM_LABEL,
        },
        availableValues: [
          { value: '0', label: '아프리카' },
          { value: '1', label: '트위치' },
          { value: '2', label: '자유게시판' },
        ],
      },
      category: {
        components: {
          list: CATEGORY_LABEL,
          show: CATEGORY_LABEL,
        },
        availableValues: [
          { value: '0', label: '일반글' },
          { value: '1', label: '공지글' },
        ],
      },
      link: {
        components: {
          show: LINK, // 글 상세보기 페이지에서 이미지, 동영상이 깨지는 문제 해결 못함. 임시로 해당 글로 이동하는 링크 추가
        },
        isVisible: showOnly,
        position: 2,
      },
      createCommentForThisPost: {
        components: { show: CREATE_COMMENT_FOR_POST },
        isVisible: showOnly,
        position: 3,
      },
    },
    navigation: {
      name: '글',
      icon: '',
    },
  },
};

export default CommunityPostResource;
