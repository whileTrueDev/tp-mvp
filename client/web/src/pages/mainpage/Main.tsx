import React from 'react';

// organisms
import ProductHero from '../../organisms/mainpage/main/productHero/ProductHero';
import WithMedia from '../../organisms/mainpage/main/withMedia/WithMedia';
import SolutionIntro from '../../organisms/mainpage/main/solutionIntro/SolutionIntro';
import SolutionCarousel from '../../organisms/mainpage/main/solutionCarousel/SolutionCarousel';
import Inquiry from '../../organisms/mainpage/main/inquiry/Inquiry';
import Footer from '../../organisms/shared/footer/Footer';
import Appbar from '../../organisms/shared/Appbar';

export default function Main(): JSX.Element {
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
