import { ResourceWithOptions } from 'admin-bro';
import { CREATED_AT__DESC } from '../config';
import { FeatureSuggestionEntity } from '../../resources/featureSuggestion/entities/featureSuggestion.entity';

const FeatureSuggestionResource: ResourceWithOptions = {
  resource: FeatureSuggestionEntity,
  options: {
    sort: CREATED_AT__DESC,
    listProperties: [
      'suggestionId',
      'title',
      'createdAt',
      'category',
      'userIp',
      'state',
      'isLock',
      'content',
    ],
    properties: {
      suggestionId: { isId: true },
      title: { isTitle: true },
      content: { type: 'richtext' },
      state: {
        availableValues: [
          { value: '0', label: '미확인' },
          { value: '1', label: '검토중' },
          { value: '2', label: '개발확정' },
          { value: '3', label: '개발보류' },
        ],
      },
    },
    navigation: {
      name: '글',
      icon: '',
    },
  },
};

export default FeatureSuggestionResource;
