import { ResourceWithOptions } from 'admin-bro';
import { CommunityPostEntity } from '../../resources/communityBoard/entities/community-post.entity';
import { CREATE_DATE__DESC } from '../config';

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
      content: { type: 'richtext' },
      platform: {
        components: {
          // list: AdminBro.bundle('../components/custom-label.tsx'),
        },
        availableValues: [
          { value: '0', label: '아프리카' },
          { value: '1', label: '트위치' },
          { value: '2', label: '자유게시판' },
        ],
      },
      category: {
        availableValues: [
          { value: '0', label: '일반글' },
          { value: '1', label: '공지글' },
        ],
      },
    },
    navigation: {
      name: '글',
      icon: '',
    },
  },
};

export default CommunityPostResource;
