import React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import HighlightAnalysisHero from '../../../organisms/mypage/highlightAnalysis/HighlightAnalysisHero';
import HighlightAnalysisLayout from '../../../organisms/mypage/layouts/HighlightAnalysisLayout';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';

export default function HighlightAnalysis(): JSX.Element {
  const theme = useTheme();
  return (
    <>
      <MypageSectionWrapper color={theme.palette.grey[400]}>
        <HighlightAnalysisHero />
      </MypageSectionWrapper>
      <MypageSectionWrapper>
        <HighlightAnalysisLayout />
      </MypageSectionWrapper>
    </>
  );
}
