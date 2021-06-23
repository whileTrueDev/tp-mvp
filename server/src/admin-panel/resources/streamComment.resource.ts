import { ResourceWithOptions } from 'admin-bro';
import { StreamCommentsEntity } from '../../resources/broadcast-info/entities/streamComment.entity';

const StreamCommentsResource: ResourceWithOptions = {
  resource: StreamCommentsEntity,
  options: {
    listProperties: [
    ],
    properties: {
    },
    navigation: {
      name: '댓글',
      icon: '',
    },
  },
};

export default StreamCommentsResource;
