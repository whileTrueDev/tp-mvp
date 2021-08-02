import AdminBro, { ResourceWithOptions } from 'admin-bro';
import { CreatorRatingsEntity } from '../../resources/creatorRatings/entities/creatorRatings.entity';

const CreatorRatingsResource: ResourceWithOptions = {
  resource: CreatorRatingsEntity,
  options: {
    actions: {
      edit: { isVisible: false },
    },
    sort: {
      sortBy: 'updateDate',
      direction: 'desc',
    },
    listProperties: [
      'creatorId',
      'platform',
      'updateDate',
      'userId',
      'rating',
      'userIp',
    ],
    properties: {
      creatorId: {
        components: {
          list: AdminBro.bundle('../components/creator-link'),
        },
      },
    },
    navigation: {
      name: '평점',
      icon: '',
    },
  },
};

export default CreatorRatingsResource;
