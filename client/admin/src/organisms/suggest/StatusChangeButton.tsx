import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
import useAxios from 'axios-hooks';

const useStyles = makeStyles({
  button: {
    backgroundColor: '#ffef62',
  },
});

/*
statusProps
**********************************************************************************
StatusChangebutton를 위한 props입니다.
**********************************************************************************
selectedData :  진행상태를 표시할 data에대한 props입니다.
handleReload :  reloading을 위한 props입니다.
**********************************************************************************
 */
interface statusProps {
  selectedData: any;
  handleReload: () => void;
}

/* 
StatusChangebutton
**********************************************************************************
<개요>
진행상태를 변형하는 버튼입니다.
<백엔드로요청>
  url: '/feature-suggestion/state', method: 'PATCH',
**********************************************************************************
1. Material ui의 MenuItem list component가 위치합니다.
2. 버튼 클릭시 해당 상태에대한 백엔드로의 수정요청을 보냅니다.
**********************************************************************************
 */
export default function StatusChangebutton(props: statusProps): JSX.Element {
  const { selectedData, handleReload } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();

  const [, executePatch] = useAxios({
    url: '/feature-suggestion/state', method: 'PATCH',
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
            }).then((res) => {
              handleReload();
            }).catch((err) => false);
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
            }).then((res) => {
              handleReload();
            }).catch((err) => false);
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
            }).then((res) => {
              handleReload();
            }).catch((err) => false);
          }
        }}
        >
          구현완료
        </MenuItem>
      </Menu>
    </div>
  );
}
