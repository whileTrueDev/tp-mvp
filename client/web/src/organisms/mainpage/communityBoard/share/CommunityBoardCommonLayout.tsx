import React, { useMemo } from 'react';
import Appbar from '../../../shared/Appbar';
import Footer from '../../../shared/footer/Footer';
import { SampleProvider } from '../../../../utils/contexts/BoardContext';

interface PropsType extends Record<string, any>{
  children?: JSX.Element[] | JSX.Element | any | any[];
}
export default function CommunityBoardCommonLayout(props: PropsType): JSX.Element {
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);
  const { children } = props;
  return (
    <div>
      {memoAppbar}
      <SampleProvider>
        {children}
      </SampleProvider>

      {memoFooter}
    </div>

  );
}
