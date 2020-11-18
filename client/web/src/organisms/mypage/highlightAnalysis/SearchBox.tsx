import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField, ClickAwayListener, Popper, List, ListItem,
  Typography,
} from '@material-ui/core';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import CheckIcon from '@material-ui/icons/Check';
import { useSnackbar } from 'notistack';
import useEventTargetValue from '../../../utils/hooks/useEventTargetValue';
import { spreadKorean } from './spreadKorean';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '70px',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textField: {
    marginRight: theme.spacing(2),
    width: '200px',
  },
  arrowIcon: {
    marginRight: theme.spacing(2),
    fontSize: '60px',
    fontWeight: 'bold',
  },
  analysisWordWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  quotesImg: { width: '22px', height: '22px' },
  analysisWord: { margin: theme.spacing(2) },
  popper: {
    display: 'flex',
    flexDirection: 'column',
    width: '200px',
    zIndex: 999,
    marginTop: 0,
  },
  list: { backgroundColor: theme.palette.background.paper },
  listItem: {
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkIcon: {
    color: 'green',
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
}));

export interface SearchBoxProps {
  words: string[];
  handleAnalysisWord: (targetWord: string) => void;
  analysisWord?: string;
}

export default function SearchBox(props: SearchBoxProps): JSX.Element {
  const classes = useStyles();
  const {
    words, handleAnalysisWord, analysisWord,
  } = props;

  const {
    value, handleChange, setValue,
  } = useEventTargetValue(); // text input

  const {
    anchorEl, handleAnchorClose, handleAnchorOpenWithRef,
  } = useAnchorEl(); // popper ref
  const targetRef = React.useRef<HTMLDivElement | null>(null);

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0); // selected popper list item index
  const { enqueueSnackbar } = useSnackbar();

  /**
   * 입력한 단어를 단어 리스트에 존재하는 스트링 중 최대 일치 스트링 비교 후 필터링
   * @param targetString 사용자가 입력한 e.target.value
   */
  const filterKoeranSpread = (targetString: string): string[] => {
    const includedWords: string[] = words.filter(
      (word) => spreadKorean(targetString).split('').every(
        (each) => spreadKorean(word).split('').includes(each),
      ),
    );

    const longestLength = includedWords.length > 1 ? includedWords.sort((a, b) => b.length - a.length)[0].length : 1;
    /* 자모 전부 포함되는 단어 리스트를
       가중치 합이 가장 큰 단어를 기준으로 내림차순 정렬
    */
    return includedWords.sort((a, b) => targetString.split('').reduce((acc, curr, index) => {
      if (spreadKorean(a).indexOf(targetString.split('')[0]) > spreadKorean(b).indexOf(targetString.split('')[0])) {
        return acc + (longestLength - index);
      }
      return acc - (longestLength - index);
    }, 0));
  };

  /**
   * up , down , enter 키보드 리스트 셀렉터
   * @param e popper 가 열린 이후 keyboard input, focus 는 그대로 텍스트 필드에
   */
  const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowDown') {
      if (!anchorEl) handleAnchorOpenWithRef(targetRef);
      if (filterKoeranSpread(value)[selectedIndex + 1]) {
        if (selectedIndex + 1 < words.length) setSelectedIndex(selectedIndex + 1);
      } else setSelectedIndex(0);
    } else if (e.key === 'ArrowUp') {
      if (!anchorEl) handleAnchorOpenWithRef(targetRef);
      if (filterKoeranSpread(value)[selectedIndex - 1]) {
        if (selectedIndex - 1 >= 0) setSelectedIndex(selectedIndex - 1);
      } else setSelectedIndex(words.length - 1);
    } else if (e.key === 'Enter') {
      if (filterKoeranSpread(value).includes(value)) handleAnalysisWord(value);
      else if (filterKoeranSpread(value)[selectedIndex]) {
        handleAnalysisWord(filterKoeranSpread(value)[selectedIndex]);
        setValue(filterKoeranSpread(value)[selectedIndex]);
      } else ShowSnack('단어 목록에 존재하는 단어만 분석 할 수 있습니다. 다시 선택해주세요', 'info', enqueueSnackbar);
      handleAnchorClose();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleAnchorClose}>
      <div className={classes.root} ref={targetRef}>

        <TextField
          variant="outlined"
          // autoFocus
          label="검색값"
          color="primary"
          onClick={() => handleAnchorOpenWithRef(targetRef)}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            setSelectedIndex(0);
            handleAnchorOpenWithRef(targetRef);
          }}
          onKeyUp={(event) => {
            handleKeyboard(event);
          }}
          className={classes.textField}
        />

        <TrendingFlatIcon className={classes.arrowIcon} />

        {analysisWord && (
        <Typography
          variant="h4"
          color="textSecondary"
          className={classes.analysisWordWrapper}
        >
          <img src="/images/analyticsPage/quotesLeft.png" alt="left qut" className={classes.quotesImg} />
          <div className={classes.analysisWord}>
            {`${analysisWord}`}
          </div>
          <img src="/images/analyticsPage/quotesRight.png" alt="right qut" className={classes.quotesImg} />
        </Typography>
        )}

        {anchorEl && (
        <Popper
          placement="bottom-start"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          disablePortal
          modifiers={{
            flip: { enabled: false },
            preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
            hide: { enabled: false },
          }}
          className={classes.popper}
        >
          <List className={classes.list}>
            {filterKoeranSpread(value).map((word, index) => (
              <ListItem
                key={word}
                button
                onClick={() => {
                  handleAnalysisWord(word); setValue(word);
                }}
                className={classes.listItem}
                selected={selectedIndex === index}
              >
                <Typography variant="h6">
                  {word}
                </Typography>

                {selectedIndex === index && (<CheckIcon className={classes.checkIcon} />)}

              </ListItem>
            ))}
          </List>

        </Popper>
        )}

      </div>
    </ClickAwayListener>
  );
}
