import {
  Grid, Tab, Tabs, Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import useAxios from 'axios-hooks';
import { useStyles, useTabs, useTabItem } from './style/TopTenCard.style';
import ToptenList from './sub/TopTenList';

const columns = [
  { name: 'admire', label: '감탄점수', icon: <PersonPinIcon /> },
  { name: 'smile', label: '웃음점수', icon: <PersonPinIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <PhoneIcon /> },
  { name: 'cuss', label: '욕점수', icon: <FavoriteIcon /> },
];
function TopTenCard(): JSX.Element {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const tabsStyles = useTabs();
  const tabItemStyles = useTabItem();

  const [{ data, loading, error }, refetch] = useAxios({
    url: '/rankings/top-ten',
    params: { column: columns[0].name },
  });

  const onChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setTabIndex(value);
    refetch({ params: { column: columns[value].name } });
  };

  if (error) {
    console.error(error);
  }
  return (
    <section className={classes.topTenWrapper}>
      <Grid container>
        <Grid item xs={2}>
          <header className={classes.header}>
            <Typography>반응별 랭킹</Typography>
            <Typography variant="h4">TOP 10</Typography>
          </header>
          <Tabs
            classes={tabsStyles}
            orientation="vertical"
            value={tabIndex}
            onChange={onChange}
          >
            {columns.map((c: typeof columns[0]) => (
              <Tab
                classes={tabItemStyles}
                key={c.name}
                icon={c.icon}
                label={c.label}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          {loading && <div>loading...</div>}
          <ToptenList data={data} />
        </Grid>
      </Grid>
    </section>
  );
}

export default TopTenCard;
