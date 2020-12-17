import React, { useState, useRef } from 'react';
import {
  Checkbox, FormControlLabel, Button,
  Typography, Input, Container, Grid, CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import axios from '../../../utils/axios';
import useDialog from '../../../utils/hooks/useDialog';
import Dialog from '../../../atoms/Dialog/Dialog';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(18),
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(14),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(10),
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(6),
    },
  },
  title: {
    marginTop: '20px',
    marginBottom: '30px',
    fontWeight: 600,
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    },
  },
  subTitle: {
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    },
  },
  contentWraper: {
    margin: '20px auto',
    wordBreak: 'keep-all',
  },
  cardWrapper: {
    zIndex: 1,
    width: '100%',
  },
  card: {
    margin: '20px auto',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
    padding: theme.spacing(8, 3),
    width: '70%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 1),
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  cardContent: {
    marginBottom: theme.spacing(5),
  },
  datailContent: {
    minWidth: 30,
    marginTop: theme.spacing(2),
    borderRadius: 3,
    border: `1px solid ${theme.palette.primary.main}`,
    width: '100%',
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
    },
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  checkboxRoot: {
    color: theme.palette.primary.main,
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  detailWrap: {
    padding: '0 16px',
    [theme.breakpoints.down('xs')]: {
      padding: '0 10px',
    },
  },
  checked: {},
  button: {
    width: '200px',
    background: theme.palette.primary.main,
    color: 'white',
    height: '50px',
    fontSize: '20px',
    [theme.breakpoints.down('xs')]: {
      width: '150px',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  detailTitle: {

    fontWeight: 600,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    },
  },
  inputStyle: {
    boxShadow: `0px 0px 5px ${theme.palette.secondary.light}`,
    border: `1px solid ${theme.palette.primary.light}`,
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const initialContent = {
  name: '',
  platForm: '',
  creatorName: '',
  content: '',
  privacyAgreement: false,
  phoneNum: '',
  idForTest: '',
};

const InquiryResult: any = {};

export default function CBTInquiry(): JSX.Element {
  const classes = styles();
  const confirmDialog = useDialog();
  const { enqueueSnackbar } = useSnackbar();

  // 개인정보 제공 동의 체크를 위한 상태
  const [checked, setChecked] = useState(false);
  function handleChange(): void {
    setChecked(!checked);
  }

  // 문의 정보 상태
  const [inquiryContent, setInquiryContent] = useState(initialContent);
  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.currentTarget;
    InquiryResult[name] = value;
    setInquiryContent(InquiryResult);
  }

  // 문의 form ref
  const formRef = useRef<HTMLFormElement | null>(null);
  // 문의 요청 중 로딩에 대한 상태
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const AnonymousUser = inquiryContent;
    setLoading(true);

    if (!checked) {
      setLoading(false);
      ShowSnack('개인정보수집 및 이용안내에 동의해주세요', 'info', enqueueSnackbar);
    } else {
      AnonymousUser.privacyAgreement = true;
      axios.post('/cbtinquiry', AnonymousUser)
        .then(() => {
          confirmDialog.handleOpen();
          setInquiryContent(initialContent);
          setChecked(false);
          setLoading(false);
          if (formRef && formRef.current) {
            formRef.current.reset();
          }
        })
        .catch((err) => {
          setLoading(false);
          ShowSnack('불편을 드려 대단히 죄송합니다.\nCBT 신청중 오류가 발생했습니다.\ntruepointceo@gmail.com 메일로 보내주시면 감사하겠습니다.', 'error', enqueueSnackbar);
        });
    }
  }

  return (
    <div className={classes.root}>
      <Container>
        <Typography variant="h4" align="center" className={classes.title}>
          CBT 신청하기
        </Typography>
        <Typography variant="h5" align="center" className={classes.subTitle}>
          신청확인 후 CBT용 ID/PW 를 전송해드립니다.
        </Typography>
        <Grid container className={classes.contentWraper} direction="column">
          <form onSubmit={handleSubmit} className={classes.cardWrapper} ref={formRef}>
            <Grid container className={classes.card} direction="column">

              <Grid container direction="row" alignItems="center" className={classes.cardContent}>
                <Grid item xs={12} sm={12} md={6} className={classes.detailWrap} style={{ marginTop: 16 }}>
                  <Typography className={classes.detailTitle}>
                    성명
                    <Typography variant="caption" color="error">(필수)</Typography>
                  </Typography>
                  <Input
                    className={classes.datailContent}
                    classes={{ focused: classes.inputStyle }}
                    autoComplete="off"
                    disableUnderline
                    onChange={onChange}
                    required
                    name="name"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} className={classes.detailWrap} style={{ marginTop: 16 }}>
                  <Typography className={classes.detailTitle}>
                    희망 로그인 ID
                    <Typography variant="caption" color="error">(필수)</Typography>
                  </Typography>
                  <Input
                    className={classes.datailContent}
                    classes={{ focused: classes.inputStyle }}
                    autoComplete="off"
                    placeholder="작성하신 ID로 테스트계정을 생성하여 제공합니다."
                    disableUnderline
                    onChange={onChange}
                    required
                    name="idForTest"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} className={classes.detailWrap} style={{ marginTop: 16 }}>
                  <Typography className={classes.detailTitle}>
                    방송 플랫폼
                    <Typography variant="caption" color="error">(필수)</Typography>
                  </Typography>
                  <Input
                    className={classes.datailContent}
                    classes={{ focused: classes.inputStyle }}
                    autoComplete="off"
                    placeholder="유튜브, 아프리카tv, 트위치"
                    disableUnderline
                    onChange={onChange}
                    required
                    name="platform"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} className={classes.detailWrap} style={{ marginTop: 16 }}>
                  <Typography className={classes.detailTitle}>
                    방송 플랫폼의 활동명
                    <Typography variant="caption" color="error">(필수)</Typography>
                  </Typography>
                  <Input
                    className={classes.datailContent}
                    classes={{ focused: classes.inputStyle }}
                    autoComplete="off"
                    placeholder="ex) 기뉴다"
                    disableUnderline
                    onChange={onChange}
                    required
                    name="creatorName"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.detailWrap} style={{ marginTop: 16 }}>
                  <Typography className={classes.detailTitle}>
                    연락처
                    <Typography variant="caption" color="error">(필수)</Typography>
                  </Typography>
                  <Input
                    className={classes.datailContent}
                    classes={{ focused: classes.inputStyle }}
                    type="tel"
                    placeholder="이메일, 전화번호 등 테스터용 ID/PW를 전송받으실 연락처를 입력해주세요"
                    autoComplete="off"
                    disableUnderline
                    onChange={onChange}
                    required
                    name="phoneNum"
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.cardContent}>
                <Grid item xs={12} sm={12} className={classes.detailWrap}>
                  <Typography className={classes.detailTitle}>
                    기타 문의 내용
                  </Typography>
                  <Input
                    classes={{ focused: classes.inputStyle }}
                    className={classes.datailContent}
                    disableUnderline
                    onChange={onChange}
                    multiline
                    placeholder="이용방법, 기타 문의 등 어떠한 내용도 괜찮습니다."
                    rows={5}
                    name="content"
                  />
                </Grid>
              </Grid>

              <Grid container direction="column" alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        onChange={handleChange}
                        checked={checked}
                        classes={{
                          root: classes.checkboxRoot,
                          checked: classes.checked,
                        }}
                      />
                    )}
                    label="개인정보수집 및 이용안내에 동의합니다."
                    style={{ margin: '20px auto' }}
                  />
                </Grid>

                <Button
                  className={classes.button}
                  type="submit"
                  disabled={loading}
                >
                  CBT 신청하기
                  {loading && (
                    <CircularProgress
                      disableShrink
                      size={16}
                      thickness={5}
                      variant="indeterminate"
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        <Dialog
          open={Boolean(confirmDialog.open)}
          onClose={confirmDialog.handleClose}
          fullWidth
          title="CBT 신청완료"
          maxWidth="xs"
          callback={() => {
            confirmDialog.handleClose();
          }}
        >
          <p style={{ textAlign: 'center', fontSize: '20px', marginTop: 30 }}>CBT 신청이 완료되었습니다.</p>
        </Dialog>
      </Container>
    </div>
  );
}
