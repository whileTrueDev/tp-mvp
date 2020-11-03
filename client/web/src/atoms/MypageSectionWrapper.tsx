import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mypageWrapper: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
  },
}));

export interface MypageWrapperProps extends React.HTMLAttributes<HTMLDivElement>{
  color?: string;
  children: React.ReactNode;
}
export default function MypageSectionWrapper({
  color = 'parent',
  children,
  style,
  className,
  ...props
}: MypageWrapperProps): JSX.Element {
  const classes = useStyles();
  return (
    <section
      className={classnames(classes.mypageWrapper, className)}
      {...props}
      style={{ backgroundColor: color, ...style }}
    >
      {children}
    </section>
  );
}
