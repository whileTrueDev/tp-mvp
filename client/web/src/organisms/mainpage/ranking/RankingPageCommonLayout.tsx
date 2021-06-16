import React, { useMemo } from 'react';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import Appbar from '../../shared/Appbar';
import Footer from '../../shared/footer/Footer';
import { useRankingPageLayout } from './style/RankingPage.style';
import HeaderDecoration from './sub/HeaderDecoration';

export default function RankingPageCommonLayout({ children }: {
  children? : React.ReactNode;
}): JSX.Element {
  const wrapper = useRankingPageLayout();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);
  const headerDecoration = useMemo(() => <HeaderDecoration />, []);
  const { isMobile } = useMediaSize();
  return (
    <div className={wrapper.background}>
      {memoAppbar}
      {!isMobile && headerDecoration}

      {children}
      {memoFooter}
    </div>
  );
}
