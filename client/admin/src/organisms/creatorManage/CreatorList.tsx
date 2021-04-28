import {
  Box, Button, InputAdornment, TextField, Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import useDialog from '../../util/hooks/useDialog';
import CreatorListItem from './CreatorListItem';
import RegisterCreatorDialog from './RegisterCreatorDialog';

export default function CreatorList(): React.ReactElement {
  const history = useHistory();
  const createDialog = useDialog();
  const [{ data }, reload] = useAxios<User[]>('/users/id-list');

  const [searchText, setSearchText] = useState<string>();
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  return (
    <Box>
      <Button
        onClick={createDialog.handleOpen}
        color="primary"
        variant="contained"
      >
        + 새 크리에이터 생성
      </Button>

      <Box my={2}>
        <TextField
          label="검색"
          variant="outlined"
          margin="dense"
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
          }}
        />
      </Box>
      <Box mt={2} display="flex" flexDirection="column" alignItems="flex-start">
        <Typography>크리에이터 목록</Typography>
        {data && data
          .filter((x) => (searchText
            ? x.nickName.includes(searchText) || x.userId.includes(searchText)
            : x))
          .map((user) => (
            <CreatorListItem
              handleSelect={() => {
                history.push(`${history.location.pathname}/${user.userId}`, user);
              }}
              key={user.userId}
              userId={user.userId}
              nickName={user.nickName}
              afreecaId={user.afreeca?.afreecaId}
              youtubeId={user.youtube?.youtubeId}
              twitchId={user.twitch?.twitchId}
              detail={user.detail}
            />
          ))}
      </Box>

      {/* 새 크리에이터 생성 다이얼로그 */}
      <RegisterCreatorDialog
        alreadyRegisteredUsers={data}
        reloadUsersData={reload}
        open={createDialog.open}
        onClose={createDialog.handleClose}
      />
    </Box>
  );
}
