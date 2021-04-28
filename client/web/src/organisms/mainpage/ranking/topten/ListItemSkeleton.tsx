import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import classnames from 'classnames';
import { useTopTenList } from '../style/TopTenList.style';

interface Props{
  headerColumns: {width: string}[]
}
function ListItemSkeleton(props: Props): JSX.Element {
  const classes = useTopTenList();
  const theme = useTheme();
  const { headerColumns } = props;

  return (
    <div className={classnames(classes.listItem, classes.placeholder)}>
      <div style={{ width: headerColumns[0].width }}>
        <Skeleton variant="rect" width="100%" height={theme.spacing(4)} />
      </div>
      <div style={{ width: headerColumns[1].width }}>
        <Skeleton variant="circle" width={theme.spacing(10)} height={theme.spacing(10)} />
      </div>
      <div style={{ width: headerColumns[2].width }}>
        <Skeleton width="90%" height={theme.spacing(4)} />
        <Skeleton width="90%" />
        <Skeleton width="90%" />
      </div>
      <div style={{ width: headerColumns[3].width }}>
        <Skeleton variant="rect" width="90%" height={theme.spacing(10)} />
      </div>
    </div>
  );
}

export default ListItemSkeleton;
