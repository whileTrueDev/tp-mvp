import { Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import YoutubeHighlightListHero from './YoutubeHighlightListHero';

const useStyles = makeStyles((theme: Theme) => createStyles({
  button: {
    flex: 1,
    backgroundColor: theme.palette.action.disabled,
    opacity: 0.5,
    fontWeight: theme.typography.fontWeightBold,
    '&.selected': {
      opacity: 1,
      backgroundColor: theme.palette.background.paper,
    },
  },
}));
interface Props{
  afreecaBoard: JSX.Element;
  twitchBoard: JSX.Element;
}
export default function MobileYoutubeHighlightList(props: Props): JSX.Element {
  const { afreecaBoard, twitchBoard } = props;
  const [tab, setTab] = useState<'twitch'|'afreeca'>('afreeca');
  const classes = useStyles();

  const selectAfreecaTab = () => {
    setTab('afreeca');
  };
  const selectTwitchTab = () => {
    setTab('twitch');
  };

  return (
    <div>
      <YoutubeHighlightListHero />

      <div style={{ display: 'flex', padding: '8px' }}>
        <Button
          variant="outlined"
          className={classNames('afreeca', classes.button, { selected: tab === 'afreeca' })}
          onClick={selectAfreecaTab}
        >
          <img width={32} height={32} src="/images/logo/afreecaLogo.png" alt="아프리카" />
          <Typography>아프리카TV</Typography>
        </Button>
        <Button
          variant="outlined"
          className={classNames('twitch', classes.button, { selected: tab === 'twitch' })}
          onClick={selectTwitchTab}
        >
          <img width={32} height={32} src="/images/logo/twitchLogo.png" alt="트위치" />
          <Typography>트위치TV</Typography>
        </Button>
      </div>

      <div role="tabpanel" hidden={tab !== 'afreeca'}>
        {afreecaBoard}
      </div>
      <div role="tabpanel" hidden={tab !== 'twitch'}>
        {twitchBoard}
      </div>
    </div>
  );
}
