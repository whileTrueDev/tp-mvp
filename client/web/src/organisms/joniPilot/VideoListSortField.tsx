import React from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

export interface VideoListSortFieldPropsType{
  field? : string;
  handleChange? : (event: React.ChangeEvent<{ value: any;}>) => void
}

const useStyles = makeStyles(() => createStyles({
  container: {
    textAlign: 'right',
  },
  select: {
    border: '1px solid #d7dae2',
    padding: '0.5em 1em',
    borderRadius: '4px',
    fontSize: '21px',
  },
}));

export type FieldType = 'date'|'views'|'likes'|'comments';
const menuItemList = [
  { value: 'date', text: '업로드 날짜' },
  { value: 'likes', text: '좋아요 수' },
  { value: 'comments', text: '댓글 수' },
  { value: 'views', text: '조회 수' },
];

export default function VideoListSortFieldSelect(props: VideoListSortFieldPropsType): JSX.Element {
  const classes = useStyles();
  const { field, handleChange } = props;
  return (
    <div className={classes.container}>
      <Select
        className={classes.select}
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
    </div>
  );
}
