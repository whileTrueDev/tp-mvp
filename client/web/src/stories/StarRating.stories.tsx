import React from 'react';
import { Story, Meta } from '@storybook/react';
import StarRating, { StarRatingProps } from '../organisms/mainpage/ranking/sub/StarRating';

export default {
  title: 'StarRating',
  component: StarRating,
} as Meta;

const Template: Story<StarRatingProps> = (args) => <StarRating {...args} />;

export const Default = Template.bind({});
Default.args = {
  score: 3,
};

export const NullScore = Template.bind({});
NullScore.args = {
  score: null,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  score: 3,
  readOnly: true,
};
