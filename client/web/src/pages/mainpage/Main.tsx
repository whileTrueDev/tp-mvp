import React from 'react';

// organisms
import ProductHero from '../../organisms/mainpage/main/productHero/ProductHero';
import WithMedia from '../../organisms/mainpage/main/withMedia/WithMedia';
import SolutionIntro from '../../organisms/mainpage/main/solutionIntro/SolutionIntro';
import SolutionCarousel from '../../organisms/mainpage/main/solutionCarousel/SolutionCarousel';
import Inquiry from '../../organisms/mainpage/main/inquiry/Inquiry';
import Footer from '../../organisms/shared/footer/Footer';

export default function Main():JSX.Element {
  return (
    <div>
      {/* 최상단 바 들어가야 함 */}
      <ProductHero />
      <WithMedia />
      <SolutionIntro />
      <SolutionCarousel />
      <Inquiry />
      <Footer />
    </div>
  );
}
