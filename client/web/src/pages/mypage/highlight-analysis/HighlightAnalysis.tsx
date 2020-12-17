import React from 'react';
import MypageHero from '../../../organisms/shared/sub/MypageHero';
import HighlightAnalysisLayout from '../../../organisms/mypage/layouts/HighlightAnalysisLayout';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import textSource from '../../../organisms/shared/source/MypageHeroText';
import useScrollTop from '../../../utils/hooks/useScrollTop';

export default function HighlightAnalysis(): JSX.Element {
  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (
    <>
      <MypageSectionWrapper>
        <MypageHero textSource={textSource.hightlightHeroSection} />
      </MypageSectionWrapper>
      <MypageSectionWrapper>
        <HighlightAnalysisLayout />
      </MypageSectionWrapper>
    </>
  );
}
