import React from 'react';
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

export interface SearchBoxProps {
  words: string[];
  handleAnalysisWord: (targetWord: string) => void;
  analysisWord?: string;
}

export default function SearchBox(props: SearchBoxProps): JSX.Element {
  const {
    words, handleAnalysisWord, analysisWord,
  } = props;

  const {
    value, handleChange, setValue,
  } = useEventTargetValue();

  const {
    anchorEl, handleAnchorClose, handleAnchorOpenWithRef,
  } = useAnchorEl();
  const targetRef = React.useRef<HTMLDivElement | null>(null);

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * 입력한 단어를 단어 리스트에 존재하는 스트링 중 최대 일치 스트링 비교 후 필터링
   * @param targetString 사용자가 입력한 e.target.value
   * 
   * 추후 추가사항 -> 최대부분 집합에서 종속 순열 찾기로
   */
  const filterKoeranSpread = (targetString: string): string[] => words
    .filter(
      (word) => spreadKorean(targetString).split('').every(
        (each) => spreadKorean(word).split('').includes(each),
      ),
    );

  /**
   * up , down , enter 키보드 리스트 셀렉터
   * @param e popper 가 열린 이후 keyboard input, focus 는 그대로 텍스트 필드에
   */
  const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowDown') {
      if (!anchorEl) handleAnchorOpenWithRef(targetRef);
      // console.log('up');
      if (filterKoeranSpread(value)[selectedIndex + 1]) {
        if (selectedIndex + 1 < words.length) setSelectedIndex(selectedIndex + 1);
      } else setSelectedIndex(0);
    } else if (e.key === 'ArrowUp') {
      if (!anchorEl) handleAnchorOpenWithRef(targetRef);
      // console.log('down');
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
      <div
        ref={targetRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '70px',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >

        <TextField
          variant="outlined"
          autoFocus
          label="검색값"
          color="primary"
          onClick={() => {
            handleAnchorOpenWithRef(targetRef);
            // handleAnchorOpen(e);
          }}
          value={value}
          onChange={(e) => {
            handleChange(e);
            setSelectedIndex(0);
            if (!anchorEl) handleAnchorOpenWithRef(targetRef);
          }}
          onKeyUp={(event) => {
            handleKeyboard(event);
          }}
          style={{
            marginRight: '16px',
            width: '200px',
          }}
        />

        <TrendingFlatIcon
          color="primary"
          style={{
            marginRight: '16px',
            fontSize: '60px',
            fontWeight: 'bold',
          }}
        />

        {analysisWord && (
        <Typography
          variant="h4"
          color="textSecondary"
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <img src="/images/analyticsPage/quotesLeft.png" alt="left qut" style={{ width: '22px', height: '22px' }} />
          <div style={{ margin: '8px' }}>
            {`${analysisWord}`}
          </div>
          <img src="/images/analyticsPage/quotesRight.png" alt="left qut" style={{ width: '22px', height: '22px' }} />
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '200px',
            zIndex: 999,
            marginTop: 0,
          }}
        >
          <List
            style={{
              backgroundColor: '#ffff',
            }}
          >
            {filterKoeranSpread(value).map((word, index) => (
              <ListItem
                key={word}
                button
                onClick={() => {
                  handleAnalysisWord(word); setValue(word);
                }}
                style={{
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
                selected={selectedIndex === index}
              >
                <Typography variant="h6" style={{ alignSelf: 'flex-start', marginLeft: '8px' }}>
                  {word}
                </Typography>

                {selectedIndex === index && (
                  <CheckIcon
                    style={{
                      color: 'green',
                      fontWeight: 'bold',
                      marginRight: '8px',
                    }}
                  />
                )}

              </ListItem>
            ))}
          </List>

        </Popper>
        )}

      </div>
    </ClickAwayListener>
  );
}
