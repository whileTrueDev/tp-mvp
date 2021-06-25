import { ResourceWithOptions } from 'admin-bro';
import { StreamsEntity } from '../../resources/broadcast-info/entities/streams.entity';

const StreamsResource: ResourceWithOptions = {
  resource: StreamsEntity,
  options: {
    actions: {
      show: { isVisible: false },
      list: { isVisible: false },
    },
    properties: {
      streamId: { isId: true },
      platform: { isId: true },
    },
    navigation: {
      name: '사용x',
      icon: '',
    },
  },
};

export default StreamsResource;
