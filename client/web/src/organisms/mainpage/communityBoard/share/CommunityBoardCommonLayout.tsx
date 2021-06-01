import React, { useMemo, useState } from 'react';
import Appbar from '../../../shared/Appbar';
import Footer from '../../../shared/footer/Footer';
import BoardContext, { BoardPlatform } from '../../../../utils/contexts/BoardContext';
import { MAX_WIDTH_DESKTOP } from '../../../../assets/constants';

interface PropsType extends Record<string, any>{
  children?: JSX.Element[] | JSX.Element | any | any[];
}
export default function CommunityBoardCommonLayout(props: PropsType): JSX.Element {
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);
  const { children } = props;
  const [platform, setPlatform] = useState<BoardPlatform>('free');
  const changePlatform = (newPlatform: BoardPlatform) => {
    setPlatform(newPlatform);
  };
  return (
    <div>
      {memoAppbar}
      <BoardContext.Provider value={{
        platform,
        changePlatform,
      }}
      >
        <div style={{ maxWidth: MAX_WIDTH_DESKTOP, margin: '0 auto' }}>
          {children}
        </div>
      </BoardContext.Provider>

      {memoFooter}
    </div>

  );
}
