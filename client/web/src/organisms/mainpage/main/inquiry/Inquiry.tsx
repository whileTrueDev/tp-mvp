import React, { useState, useRef } from 'react';
import {
  Checkbox, FormControlLabel, Button,
  Typography, Input, Container, Grid, CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import styles from '../style/Inquiry.style';
import axios from '../../../../utils/axios';
import useDialog from '../../../../utils/hooks/useDialog';
import Dialog from '../../../../atoms/Dialog/Dialog';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const initialContent = {
  name: '',
  content: '',
  privacyAgreement: false,
  email: '',
};

const InquiryResult: any = {};

export default function Inquiry(): JSX.Element {
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
      // 아래 요청 보내는 곳 수정해야함 Done! - from hwasurr
      axios.post('/inquiry', AnonymousUser)
        .then(() => {
          confirmDialog.handleOpen();
          setInquiryContent(initialContent);
          setChecked(false);
          setLoading(false);
          // Reset all of the input values in this form
          if (formRef && formRef.current) {
            formRef.current.reset();
          }
        })
        .catch((err) => {
          // console.log(err.response);
          setLoading(false);
          ShowSnack('불편을 드려 대단히 죄송합니다.\n문의 요청중 오류가 발생했습니다.\ntruepointceo@gmail.com 메일로 보내주시면 감사하겠습니다.', 'error', enqueueSnackbar);
        });
    }
  }

  return (
    <div className={classes.root}>
      <Container>
        <Typography variant="h3" align="center" component="h2" className={classes.title}>
          문의하기
        </Typography>
        <Typography variant="h5" align="center" component="h2" className={classes.subTitle}>
          트루포인트 사용에 대한 문의를 남겨주시면 상담해드립니다
        </Typography>
        <Grid container className={classes.contentWraper} direction="column">
          <form onSubmit={handleSubmit} className={classes.cardWrapper} ref={formRef}>
            <Grid container className={classes.card} direction="column">

              <Grid container direction="row" alignItems="center" className={classes.cardContent}>
                <Grid item xs={12} sm={6} className={classes.detailWrap}>
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
                    name="author"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.detailWrap}>
                  <Typography className={classes.detailTitle}>
                    이메일
                    <Typography variant="caption" color="error">(필수)</Typography>
                  </Typography>
                  <Input
                    className={classes.datailContent}
                    classes={{ focused: classes.inputStyle }}
                    type="email"
                    placeholder="email@email.com"
                    autoComplete="off"
                    disableUnderline
                    onChange={onChange}
                    required
                    name="email"
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.cardContent}>
                <Grid item xs={12} sm={12} className={classes.detailWrap}>
                  <Typography className={classes.detailTitle}>
                    문의 상세내용
                    <Typography variant="caption" color="error">(필수)</Typography>
                  </Typography>
                  <Input
                    classes={{ focused: classes.inputStyle }}
                    className={classes.datailContent}
                    disableUnderline
                    onChange={onChange}
                    multiline
                    placeholder="이용방법, 기타 문의 등 어떠한 내용도 괜찮습니다."
                    required
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
                  문의 남기기
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
          title="문의하기"
          maxWidth="xs"
          callback={() => {
            confirmDialog.handleClose();
          }}
        >
          <p style={{ textAlign: 'center', fontSize: '20px', marginTop: 30 }}>문의 요청 완료되었습니다.</p>
          <p style={{ textAlign: 'center', fontSize: '20px' }}>빠른 답변 드리겠습니다.</p>
        </Dialog>
      </Container>
    </div>
  );
}
