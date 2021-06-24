import { ResourceWithOptions } from 'admin-bro';
import { FeatureSuggestionReplyEntity } from '../../resources/featureSuggestion/entities/featureSuggestionReply.entity';

const FeatureSuggestionReplyResource: ResourceWithOptions = {
  resource: FeatureSuggestionReplyEntity,
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

export default FeatureSuggestionReplyResource;
