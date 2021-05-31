import classnames from 'classnames';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({

  goBackButton: {
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      left: `-${theme.spacing(1.5)}px`,
    },
    zIndex: 100,
    left: `-${theme.spacing(3.5)}px`,
    width: theme.spacing(7),
    height: theme.spacing(7),
    borderRadius: '50%',
    '& img': {
      width: '100%',
      height: '100%',
    },
  },
  center: {
    top: '50%',
  },
}));
interface GoBackButtonProps {
  center?: boolean;
}
export default function GoBackButton({
  center = true,
}: GoBackButtonProps): React.ReactElement {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Button
      className={classnames(classes.goBackButton, { [classes.center]: center })}
      onClick={history.goBack}
      aria-label="뒤로가기"
    >
      <img
        alt="뒤로가기 화살표 이미지"
        src="/images/rankingPage/backArrowImage.png"
        srcSet="/images/rankingPage/backArrowImage@2x.png 2x"
      />
    </Button>
  );
}
