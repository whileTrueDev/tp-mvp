import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mypageWrapper: {
    padding: `${theme.spacing(4)}px ${theme.spacing(5)}px ${theme.spacing(0)}`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    },
  },
  last: { padding: theme.spacing(4) },
}));

export interface MypageWrapperProps extends React.HTMLAttributes<HTMLDivElement>{
  color?: string;
  children: React.ReactNode;
  last?: boolean;
}
export default function MypageSectionWrapper({
  color = 'parent',
  last = false,
  children,
  style,
  className,
  ...props
}: MypageWrapperProps): JSX.Element {
  const classes = useStyles();
  return (
    <section
      className={classnames(classes.mypageWrapper, className, { [classes.last]: last })}
      {...props}
      style={{ backgroundColor: color, ...style }}
    >
      {children}
    </section>
  );
}
