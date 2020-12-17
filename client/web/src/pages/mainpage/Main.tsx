import React from 'react';

// organisms
import ProductHero from '../../organisms/mainpage/main/productHero/ProductHero';
import WithMedia from '../../organisms/mainpage/main/withMedia/WithMedia';
import SolutionIntro from '../../organisms/mainpage/main/solutionIntro/SolutionIntro';
import SolutionCarousel from '../../organisms/mainpage/main/solutionCarousel/SolutionCarousel';
import Inquiry from '../../organisms/mainpage/main/inquiry/Inquiry';
import Footer from '../../organisms/shared/footer/Footer';
import Appbar from '../../organisms/shared/Appbar';
import useScrollTop from '../../utils/hooks/useScrollTop';

export default function Main(): JSX.Element {
  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  return (
    <div>
      <Appbar />
      <ProductHero />
      <WithMedia />
      <SolutionIntro />
      <SolutionCarousel />
      <Inquiry />
      <Footer />
    </div>
  );
}
