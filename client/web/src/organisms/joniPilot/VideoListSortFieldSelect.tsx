import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

export interface VideoListSortFieldSelectPropsType{
  field? : string;
  handleChange? : (event: React.ChangeEvent<{ value: any;}>) => void
}

const menuItemList = [
  { value: 'date', text: '업로드 날짜' },
  { value: 'likes', text: '좋아요 수' },
  { value: 'comments', text: '댓글 수' },
  { value: 'views', text: '조회 수' },
];
export default function VideoListSortFieldSelect(props: VideoListSortFieldSelectPropsType): JSX.Element {
  const { field, handleChange } = props;
  return (
    <Select
      labelId="video-sort-field-select-label"
      id="video-sort-field-select"
      value={field}
      onChange={handleChange}
    >
      {menuItemList.map((item) => (
        <MenuItem
          value={item.value}
          key={item.value}
        >
          {item.text}
        </MenuItem>
      ))}
    </Select>
  );
}
