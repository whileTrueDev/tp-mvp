import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import useAxios from 'axios-hooks';
import { SuggestData } from '../../pages/AdminSuggest';

const useStyles = makeStyles({
  button: {
    backgroundColor: '#ffef62',
  },
});

interface statusProps {
  selectedData: SuggestData;

}

export default function StatusChangebutton(props: statusProps): JSX.Element {
  const { selectedData } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();

  const [, executePatch] = useAxios({
    url: 'http://localhost:3000/admin/feature-suggestion', method: 'PATCH',
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.button}
        variant="contained"
      >
        상태 변경
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          selectedData.state = 1;
          // console.log(selectedData);
          if (window.confirm(`상태를\n${selectedData.state}\n 으로 업로드 하시겠습니까?`)) {
            // 백엔드에 상태 업로드
            executePatch({
              data: {
                id: selectedData.suggestionId,
                state: selectedData.state,
              },
            });
            window.location.reload();
          }
        }}
        >
          검토중
        </MenuItem>
        <MenuItem onClick={() => {
          selectedData.state = 2;
          if (window.confirm(`상태를\n${selectedData.state}\n 으로 업로드 하시겠습니까?`)) {
            // 백엔드에 상태 업로드
            executePatch({
              data: {
                id: selectedData.suggestionId,
                state: selectedData.state,
              },
            });
            window.location.reload();
          }
        }}
        >
          기능 구현중
        </MenuItem>
        <MenuItem onClick={() => {
          selectedData.state = 3;
          if (window.confirm(`상태를\n${selectedData.state}\n 으로 업로드 하시겠습니까?`)) {
            // 백엔드에 상태 업로드
            executePatch({
              data: {
                id: selectedData.suggestionId,
                state: selectedData.state,
              },
            });
            window.location.reload();
          }
        }}
        >
          구현완료
        </MenuItem>
      </Menu>
    </div>
  );
}
