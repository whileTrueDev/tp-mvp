import React, { useState, useReducer } from 'react';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';

import {
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Grid,
} from '@material-ui/core';
import shortid from 'shortid';
import useStyles from './style/Paper.style';
import Dialog from '../../../atoms/Dialog/Dialog';
import terms from './source/registConfig';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import PageTitle from '../shared/PageTitle';

interface CheckState<T> {
  checkedA: T;
  checkedB: T;
  checkedC: T;
  [checkType: string]: T;
}

type CheckAction = { key: 'checkedA'; value: boolean }
  | { key: 'checkedB'; value: boolean }
  | { key: 'checkedC'; value: boolean }
  | { key: 'reset' }
  | { key: 'checkAll'}

const reducer = (
  state: CheckState<boolean>,
  action: CheckAction,
): CheckState<boolean> => {
  switch (action.key) {
    case 'checkedA':
      return { ...state, checkedA: !state.checkedA };
    case 'checkedB':
      return { ...state, checkedB: !state.checkedB };
    case 'checkedC':
      return { ...state, checkedC: !state.checkedC };
    case 'reset':
      return { checkedA: false, checkedB: false, checkedC: false };
    case 'checkAll':
      return { checkedA: true, checkedB: true, checkedC: true };
    default:
      return state;
  }
};

interface Props {
  handleBack: () => void;
  handleNext: () => void;
  setAgreement: React.Dispatch<React.SetStateAction<boolean>>;
}

function PaperSheet({ handleBack, handleNext, setAgreement }: Props): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(
    reducer, { checkedA: false, checkedB: false, checkedC: false },
  );

  const [selectTerm, setTerm] = useState({
    text: '',
    title: '',
    state: '',
  });
  const [open, setOpen] = useState(false);

  function handleChange(name: any): void {
    dispatch({ key: name });
    setOpen(false);
  }

  function handleCancel(name: any): void {
    dispatch({ key: name });
  }

  function handleClose(): void {
    setOpen(false);
  }

  function handleOpen(term: any): void {
    setTerm(term);
    setOpen(true);
  }

  function finishReg(): void {
    if (state.checkedA && state.checkedB) {
      handleNext();
    } else {
      ShowSnack('모든 약관에 동의하지 않으면 회원가입이 완료되지 않습니다.', 'warning', enqueueSnackbar);
    }
    setAgreement(state.checkedC);
  }

  const [allChecked, setAllChecked] = useState<boolean>(false);
  function checkAll(): void {
    setAllChecked(true);
    dispatch({ key: 'checkAll' });
  }
  function resetAllChecks(): void {
    setAllChecked(false);
    dispatch({ key: 'reset' });
  }

  return (
    <div>
      <PageTitle text="약관동의" />
      <div className={classnames(classes.box, classes.content)}>
        {terms.map((term: { title: string; state: string; text: string }) => (
          <div className={classes.container} key={term.state}>
            <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
                <FormControlLabel
                  control={(
                    <Checkbox
                      onChange={(): void => {
                      // 현재의 check를 확인하여 취소가 가능하게끔 만든다.
                        if (state[term.state]) {
                          handleCancel(term.state);
                        } else {
                          ShowSnack('약관보기를 통해 약관을 모두 읽어야 동의가 가능합니다.', 'warning', enqueueSnackbar);
                        }
                      }}
                      checked={state[term.state]}
                      classes={{
                        root: classes.checkboxRoot,
                        checked: classes.checked,
                      }}
                    />
                    )}
                  label=""
                  style={{ flex: 2, marginRight: 0 }}
                />
              </Grid>
              <Grid item>
                <Typography component="p" style={{ flex: 8, fontSize: 13 }}>
                  {term.title}
                </Typography>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <Button
                      className={classes.buttonStyle}
                      onClick={(): void => handleOpen(term)}
                    >
                      약관보기
                    </Button>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </div>
        ))}

        {/* 모두 동의  */}
        <FormControlLabel
          control={(
            <Checkbox
              onChange={(): void => {
                if (allChecked) {
                  resetAllChecks();
                } else {
                  checkAll();
                }
              }}
              checked={allChecked}
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checked,
              }}
            />
          )}
          label="모두 동의하기"
        />

        <div className={classnames(classes.center, classes.content)}>
          <Grid container justify="space-between" alignItems="center" spacing={1}>
            <Grid item xs={6}>
              <Button
                onClick={handleBack}
                className={classnames(classes.fullButton, classes.backButton)}
              >
                <Typography>뒤로</Typography>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                style={{ color: 'white' }}
                className={classes.fullButton}
                onClick={finishReg}
              >
                <Typography>다음</Typography>
              </Button>
            </Grid>

          </Grid>

        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        title={selectTerm.title}
        maxWidth="md"
      >
        {/* 계약 내용 */}
        <div className={classes.inDialogContent}>
          {selectTerm.text.split('\n').map((sentence) => (
            <p key={shortid.generate()} className={classes.names}>{sentence}</p>
          ))}
          <Divider />
          <Grid container direction="row" alignContent="center" justify="center">
            <Grid item>
              <p className={classes.names}>위의 내용을 올바르게 이해하셨습니까? 아래 버튼을 클릭하여 약관에 동의해주세요.</p>
            </Grid>
          </Grid>
          <Grid container direction="row" alignContent="center" justify="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(): void => handleChange(selectTerm.state)}
                className={classes.end}
              >
                {state[selectTerm.state] ? '취소' : '동의'}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Dialog>
    </div>
  );
}

export default PaperSheet;
