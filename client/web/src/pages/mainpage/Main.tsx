import React from 'react';

// organisms
import ProductHero from '../../organisms/mainpage/main/productHero/ProductHero';
import Intro from '../../organisms/mainpage/main/intro/Intro';
// CBT 이후 추가될 내용
// import SolutionCarousel from '../../organisms/mainpage/main/solutionCarousel/SolutionCarousel';
import Inquiry from '../../organisms/mainpage/main/inquiry/Inquiry';
import Footer from '../../organisms/shared/footer/Footer';
import Appbar from '../../organisms/shared/Appbar';
import useScrollTop from '../../utils/hooks/useScrollTop';
import Exanalysis from '../../organisms/mainpage/main/exanalysis/Exanalysis';
import useMediaSize from '../../utils/hooks/useMediaSize';

export default function Main(): JSX.Element {
  const { isMobile } = useMediaSize();
  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();

  return (
    <div>
      <Appbar variant={isMobile ? undefined : 'transparent'} />
      <ProductHero />
      <Intro />
      <Exanalysis />
      <Inquiry />
      <Footer />
    </div>
  );
}
