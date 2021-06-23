import { ResourceWithOptions } from 'admin-bro';
import { StreamsEntity } from '../../resources/broadcast-info/entities/streams.entity';

const StreamsResource: ResourceWithOptions = {
  resource: StreamsEntity,
  options: {
    properties: {
    },
    navigation: {
      name: '사용x',
      icon: '',
    },
  },
};

export default StreamsResource;
