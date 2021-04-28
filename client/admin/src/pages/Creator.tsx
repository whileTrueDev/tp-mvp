import {
  makeStyles, Theme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AntTab from '../atoms/tabs/AntTab';
import AntTabs from '../atoms/tabs/AntTabs';
import CreatorDetail from '../organisms/creatorManage/CreatorDetail';
import CreatorList from '../organisms/creatorManage/CreatorList';

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
  contents: { margin: theme.spacing(2, 0, 0, 2) },
}));

export default function Creator(): React.ReactElement {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };

  const { path } = useRouteMatch();
  return (
    <div>
      <Typography variant="h6">크리에이터 관리</Typography>

      <div className={classes.tabs}>
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="크리에이터 관리" />
        </AntTabs>

        <div className={classes.contents}>
          {value === 0 && (
            <Switch>
              <Route exact path={path}>
                <CreatorList />
              </Route>
              <Route path={`${path}/:userId`}>
                <CreatorDetail />
              </Route>
            </Switch>
          )}
        </div>
      </div>
    </div>
  );
}
