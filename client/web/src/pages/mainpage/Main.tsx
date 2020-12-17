import React from 'react';

// organisms
import ProductHero from '../../organisms/mainpage/main/productHero/ProductHero';
import WithMedia from '../../organisms/mainpage/main/withMedia/WithMedia';
import SolutionIntro from '../../organisms/mainpage/main/solutionIntro/SolutionIntro';
// CBT 이후 추가될 내용
// import SolutionCarousel from '../../organisms/mainpage/main/solutionCarousel/SolutionCarousel';
import Inquiry from '../../organisms/mainpage/main/inquiry/Inquiry';
import Footer from '../../organisms/shared/footer/Footer';
import Appbar from '../../organisms/shared/Appbar';

export default function Main(): JSX.Element {
  return (
    <div>
      <Appbar />
      <ProductHero pageIn="main" />
      <WithMedia />
      <SolutionIntro />
      {/* CBT 종료 후 추가될 예정 */}
      {/* <SolutionCarousel /> */}
      <Inquiry />
      <Footer />
    </div>
  );
}
