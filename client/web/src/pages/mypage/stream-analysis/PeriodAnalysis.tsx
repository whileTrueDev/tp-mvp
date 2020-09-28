import React from 'react';

import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';

import PerioudAnalysisHero from '../../../organisms/mypage/streamAnalysis/perioud-anlaysis/PerioudAnalysisHero';

export default function PeriodAnalysis(): JSX.Element {
  return (
    <MypageSectionWrapper>
      {/* 상단 섹션 */}
      <PerioudAnalysisHero />

    </MypageSectionWrapper>
  );
}
