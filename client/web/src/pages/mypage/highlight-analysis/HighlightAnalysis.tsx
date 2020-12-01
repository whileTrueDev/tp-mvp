import React from 'react';
import MypageHero from '../../../organisms/shared/sub/MypageHero';
import HighlightAnalysisLayout from '../../../organisms/mypage/layouts/HighlightAnalysisLayout';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import textSource from '../../../organisms/shared/source/MypageHeroText';

export default function HighlightAnalysis(): JSX.Element {
  return (
    <>
      <MypageSectionWrapper>
        <MypageHero textSource={textSource.hightlightHeroSection} />
      </MypageSectionWrapper>
      <MypageSectionWrapper style={{ minHeight: '1500px' }}>
        <HighlightAnalysisLayout />
      </MypageSectionWrapper>
    </>
  );
}
