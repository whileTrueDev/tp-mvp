import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import {
  Typography, Grid, makeStyles, Divider, FormControl, FormGroup, FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import ShowSnack from '../snackbar/ShowSnack';

const useStyles = makeStyles((theme) => ({
  title: {
    padding: '20px',
    widht: '600px',
  },
  root: {
    padding: '20px',
    width: '800px',
    height: '300px',
  },
  formControl: {
    margin: theme.spacing(1),
  },
  checkboxes: {
    padding: '20px',
  },
  divider: {
    padding: '20px',
    color: theme.palette.info.main,
  },

}));

interface DialogProps {
  open: boolean;
  handleClose: () => void;
  selectedData: any;
  reload: () => void;
}

export default function RegisterDialog(data: DialogProps): JSX.Element {
  const {
    open, handleClose, selectedData, reload,
  } = data;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [, executePost] = useAxios({ url: '/cbt/user', method: 'post' }, { manual: true });

  const [openInputSpace, setSpace] = React.useState(false);
  const [state, setState] = React.useState({
    afreeca: false,
    twitch: false,
    youtube: false,
  });
  const [platformName, setPlatformName] = React.useState('');
  const [value, setValue] = React.useState('');

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleInputOpen = () => {
    setSpace(true);
  };

  const handleInputClose = () => {
    setSpace(false);
  };

  const handlPlatFormId = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'afreeca': {
        const stateObject = {
          afreeca: true,
          twitch: false,
          youtube: false,
        };
        setPlatformName(event.target.name);
        handleInputOpen();
        setState(stateObject);
        break;
      }
      case 'twitch': {
        const stateObject = {
          afreeca: false,
          twitch: true,
          youtube: false,
        };
        setPlatformName(event.target.name);
        handleInputClose();
        setState(stateObject);
        break;
      }
      case 'youtube': {
        const stateObject = {
          afreeca: false,
          twitch: false,
          youtube: true,
        };
        setPlatformName(event.target.name);
        handleInputClose();
        setState(stateObject);
        break;
      }
      default:
    }
  };

  const handlePost = () => {
    const user = {
      ...selectedData,
      platform: platformName,
      afreecaId: value,
      isComplete: true,
    };
    if (user.afreecaId !== '' || user.platform) {
      executePost({
        data: user,
      }).then(() => {
        reload();
        handleClose();
      });
    } else {
      ShowSnack('아이디를 입력해주세요!!', 'warning', enqueueSnackbar);
    }
  };

  const { afreeca, twitch, youtube } = state;
  // const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <div>
      <Dialog
        open={open}

      >
        <Grid container xs={12} className={classes.root}>
          <Grid item xs={6}>

            <Grid item xs={12}>
              <Typography variant="h5" className={classes.title}>가입 시키겠습니까?</Typography>
            </Grid>

            <Grid item xs={12} style={{ marginLeft: 24 }}>
              <Typography style={{ fontWeight: 'bold' }}>제출한 이름</Typography>
              <Typography variant="body2">{selectedData.name}</Typography>
              <Typography style={{ fontWeight: 'bold' }}>제출한 활동명</Typography>
              <Typography variant="body2">{selectedData.creatorName}</Typography>
              <Typography style={{ fontWeight: 'bold' }}>제출한 사용할ID</Typography>
              <Typography variant="body2">{selectedData.idForTest}</Typography>
              <Typography style={{ fontWeight: 'bold' }}>제출한 플랫폼</Typography>
              <Typography variant="body2">{selectedData.platform}</Typography>
              <Typography style={{ fontWeight: 'bold' }}>제출한 이메일</Typography>
              <Typography variant="body2">{selectedData.email}</Typography>
              <Typography style={{ fontWeight: 'bold' }}>제출한 기타문의</Typography>
              <Typography variant="body2">{selectedData.content || '없음'}</Typography>
            </Grid>

            <Grid item container xs={12} className={classes.checkboxes}>
              <Grid item xs={1}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item xs={11}>
                <Typography variant="body2">가입시킬 플랫폼 명</Typography>
                <Typography variant="caption">아/트/유 셋 중 하나여야합니다.</Typography>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={afreeca} onChange={handlPlatFormId} name="afreeca" />}
                      label="afreeca"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={twitch} onChange={handlPlatFormId} name="twitch" />}
                      label="twitch"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={youtube} onChange={handlPlatFormId} name="youtube" />}
                      label="youtube"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Grid item xs={12}>
              { openInputSpace && (
                <div>
                  <TextField required fullWidth label="회원의 Afreeca 아이디를 입력해주세요" onChange={handleValue} value={value} />
                  <Typography variant="body2" color="error" style={{ fontWeight: 'bold' }}>*아프리카TV 데이터 수집/분석에 치명적 영향을 미치므로 오타가 없어야합니다.</Typography>
                  <Typography variant="body2">ex) 기뉴다 -- arinbbidol</Typography>
                  <Typography variant="body2">ex) 철구형2 -- y1026</Typography>
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={handlePost} disabled={(!afreeca && !twitch && !youtube) || (afreeca && !value)} color="secondary" variant="contained">
            확인
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
