import { ResourceWithOptions } from 'admin-bro';
import { FeatureSuggestionReplyEntity } from '../../resources/featureSuggestion/entities/featureSuggestionReply.entity';
import { CREATED_AT__DESC } from '../config';

const FeatureSuggestionReplyResource: ResourceWithOptions = {
  resource: FeatureSuggestionReplyEntity,
  options: {
    sort: CREATED_AT__DESC,
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

export default FeatureSuggestionReplyResource;
