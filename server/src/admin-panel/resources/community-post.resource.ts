import { ResourceWithOptions } from 'admin-bro';
import { CommunityPostEntity } from '../../resources/communityBoard/entities/community-post.entity';

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
    properties: {
      postId: { isId: true },
      title: { isTitle: true },
      createDate: { type: 'datetime' },
      content: { type: 'richtext' },
      platform: {
        availableValues: [
          { value: '0', label: '아프리카' },
          { value: '1', label: '트위치' },
          { value: '2', label: '자유게시판' },
        ],
        type: 'number',
      },
      category: {
        availableValues: [
          { value: '0', label: '일반글' },
          { value: '1', label: '공지글' },
        ],
        type: 'number',
      },
    },
    navigation: {
      name: '글',
      icon: '',
    },
  },
};

export default CommunityPostResource;
