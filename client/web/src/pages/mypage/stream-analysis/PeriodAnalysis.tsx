import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import MypageSectionWrapper from '../../../atoms/MypageSectionWrapper';
import PeriodGraph from '../../../organisms/mypage/stream-analysis/PeriodGraph';
import { timelineInterface } from '../../../organisms/mypage/graph/graphsInterface';

import PerioudAnalysisHero from '../../../organisms/mypage/streamAnalysis/perioud-anlaysis/PerioudAnalysisHero';

export default function PeriodAnalysis(): JSX.Element {
  const [data, setData] = useState<timelineInterface | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [{ loading }, getRequest] = useAxios(
    '/stream-analysis/test', { manual: true }
  );

  useEffect(() => {
    getRequest()
      .then((res) => {
        setData(res.data);
        setOpen(true);
      });
  }, [getRequest]);

  return (
    <MypageSectionWrapper>
      {/* 상단 섹션 */}
      <PerioudAnalysisHero />
      {open && data && <PeriodGraph data={data} loading={loading} />}
    </MypageSectionWrapper>
  );
}
