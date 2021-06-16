import { Theme } from '@material-ui/core';
import { CSSProperties } from 'react';

type PostItType = 'left top' | 'right bottom';

const generateTranslate = (type: PostItType): string => {
  switch (type) {
    case 'right bottom': return 'rotate(-30deg) translate(40%,-40%)';
    case 'left top': return 'rotate(-30deg) translate(-40%,40%)';
    default: return '';
  }
};

const generatePosition = (type: PostItType) => {
  switch (type) {
    case 'right bottom': return { right: 0, bottom: 0 };
    case 'left top': return { left: 0, top: 0 };
    default: return '';
  }
};

const createPostItStyles = (theme: Theme, type: PostItType, color = '#ccae79'): CSSProperties => ({
  content: "' '",
  display: 'block',
  width: '120px',
  height: '30px',
  [theme.breakpoints.down('sm')]: {
    width: '35px',
    height: '10px',
    maxWidth: 'auto',
    minWidth: 'auto',
  },
  maxWidth: theme.spacing(15),
  minWidth: theme.spacing(10),
  backgroundColor: color,
  opacity: 0.8,
  position: 'absolute',
  transformOrigin: type,
  transform: generateTranslate(type),
  ...generatePosition(type),
});

export default createPostItStyles;
