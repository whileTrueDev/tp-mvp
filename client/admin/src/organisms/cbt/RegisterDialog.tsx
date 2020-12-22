import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  Typography, Grid, makeStyles, Divider, FormControl, FormGroup, FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import ShowSnack from '../snackbar/ShowSnack';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '20px',
    width: '600px',
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
  handleAsign:()=>void;
}

export default function RegisterDialog(data: DialogProps): JSX.Element {
  const { open, handleClose, selectedData , handleAsign} = data;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();


  const [{ data: userData }, executePost] = useAxios({ url: '/cbt/user', method: 'post' }, { manual: true });

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
        return (setState(stateObject)); }
      case 'twitch': {
        const stateObject = {
          afreeca: false,
          twitch: true,
          youtube: false,
        };
        setPlatformName(event.target.name);
        handleInputClose();
        return (setState(stateObject)); }
      case 'youtube': {
        const stateObject = {
          afreeca: false,
          twitch: false,
          youtube: true,
        };
        setPlatformName(event.target.name);
        handleInputClose();
        return (setState(stateObject)); }

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
    if(user.afreecaId !== ''){
      executePost({
        data: user
      }).then((res) => {
        console.log(res.data);
        handleAsign();
        handleClose();
      }).catch((err) => {
        console.log(err.message);
      });
    }
    else{
      ShowSnack("아이디를 입력해주세요!!", "warning", enqueueSnackbar);
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

            <Grid item xs={6}>
              <Typography variant="h5" style={{ width: '600px' }}>가입 시키겠습니까?</Typography>
            </Grid>

            <Grid container xs={12} className={classes.checkboxes}>
              <Grid item xs={1}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item xs={6}>
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
              <Typography variant="body2">ex) 기뉴다 -> arinbbidol</Typography>
              </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePost} color="secondary" variant="contained">
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
