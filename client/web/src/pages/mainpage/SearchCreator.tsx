import React, { useMemo } from 'react';
import CreatorSearch from '../../organisms/mainpage/ranking/CreatorSearch';
import { useRankingPageLayout } from '../../organisms/mainpage/ranking/style/RankingPage.style';
import HeaderDecoration from '../../organisms/mainpage/ranking/sub/HeaderDecoration';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import useMediaSize from '../../utils/hooks/useMediaSize';

export default function SearchCreator(): JSX.Element {
  const wrapper = useRankingPageLayout();
  const memoAppbar = useMemo(() => <Appbar />, []);
  const memoFooter = useMemo(() => <Footer />, []);
  const headerDecoration = useMemo(() => <HeaderDecoration />, []);
  const { isMobile } = useMediaSize();
  return (
    <div className={wrapper.background}>
      {memoAppbar}
      {!isMobile && headerDecoration}
      <CreatorSearch />

      {memoFooter}
    </div>
  );
}
