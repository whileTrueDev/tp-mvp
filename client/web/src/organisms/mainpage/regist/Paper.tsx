import React, { useState, useReducer } from 'react';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';

import {
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
} from '@material-ui/core';
import shortid from 'shortid';
import useStyles from './style/Paper.style';
import terms from './source/registConfig';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import PageTitle from '../shared/PageTitle';

/** 이용약관 수신동의 부분(선택)은 제거 요청받음 2021.06.18 joni */
const termsToUse = terms.slice(0, 2);
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

  function handleChange(name: any): void {
    dispatch({ key: name });
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
        {termsToUse.map((term: { title: string; state: string; text: string }) => (
          <div className={classes.container} key={term.state}>
            <Grid container direction="column" spacing={1}>
              {/* 약관 체크박스와 제목 */}
              <Grid item>
                <FormControlLabel
                  control={(
                    <Checkbox
                      onChange={(): void => {
                        handleChange(term.state);
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
                <Typography component="span" style={{ flex: 8, fontSize: 13 }}>
                  {term.title}
                </Typography>
              </Grid>

              <Grid item>
                <div style={{ maxHeight: 150, overflow: 'scroll' }}>
                  {term.text.split('\n').map((sentence) => (
                    <p key={shortid.generate()} className={classes.names}>{sentence}</p>
                  ))}
                </div>
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

    </div>
  );
}

export default PaperSheet;
