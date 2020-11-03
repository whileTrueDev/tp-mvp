import React from 'react';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import FeatureTable from '../../organisms/mainpage/featureSuggestion/FeatureTable';
import FeatureCategoryButtonGroup from '../../organisms/mainpage/featureSuggestion/FeatureCategoryButtonGroup';
import FeatureDetail from '../../organisms/mainpage/featureSuggestion/FeatureDetail';
import { FeatureData } from '../../interfaces/FeatureSuggestion';
import Button from '../../atoms/Button/Button';
import useAuthContext from '../../utils/hooks/useAuthContext';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';

const useStyles = makeStyles((theme) => ({
  featureSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContainer: { width: 1400, margin: '100px auto', minHeight: 900 },
  contents: { marginTop: theme.spacing(4) },
}));

export default function FeatureSuggestion(): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();
  const history = useHistory();
  const { id: selectedSuggestionId } = useParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('전체');
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  function handleCategorySelect(str: string): void {
    setSelectedCategory(str);
  }

  function handleFeatureClick(num: number): void {
    history.push(`/feature-suggestion/read/${num}`);
  }
  function handleWriteClick(): void {
    history.push('/feature-suggestion/write');
  }
  function handleResetFeatureSelect(): void {
    history.push('/feature-suggestion');
  }
  const [{ loading, data }] = useAxios<FeatureData[]>({
    url: '/feature', method: 'GET',
  });
  const categoryTabSwitch = (value: number) => {
    switch (value) {
      case 0: return (<Typography> 홈페이지관련 </Typography>);
      case 1: return (<Typography> 편집점관련 </Typography>);
      case 2: return (<Typography> 기타 </Typography>);
      default: return (<Typography> 전체 </Typography>);
    }
  };
  return (
    <div>
      <Appbar />
      <ProductHero
        title="기능제안"
        content={`트루포인트 이용 중 추가되었으면 하는 기능이나 개선이 필요한 기능이 있다면 기능제안 게시판을 통해 제안해주세요.
        궁금하신 사항은 고객센터로 연락 부탁드립니다.`}
      />
      <section className={classes.featureSection}>
        <div className={classes.featureContainer}>
          <Typography variant="h4">기능제안</Typography>

          {/* 기능제안 개별 보기 */}
          {selectedSuggestionId && !loading && data ? (
            <div className={classes.contents}>
              <FeatureDetail
                selectedSuggestionId={selectedSuggestionId}
                data={data
                  .sort((row1, row2) => new Date(row2.createdAt).getTime()
                    - new Date(row1.createdAt).getTime())
                  .filter((row) => (selectedCategory !== '전체'
                    ? row.category === selectedCategory : row))}
                onOtherFeatureClick={handleFeatureClick}
                onBackClick={handleResetFeatureSelect}
                categoryTabSwitch={categoryTabSwitch}
              />
            </div>
          )
            : (
              <>
                {/* 기능제안 목록 보기 */}
                <div className={classes.contents}>
                  <FeatureCategoryButtonGroup
                    categories={!loading && data
                      ? Array
                        .from(new Set(data.map((d) => d.category)))
                        .sort()
                      : []}
                    onChange={handleCategorySelect}
                    selected={selectedCategory}
                    categoryTabSwitch={categoryTabSwitch}
                  />
                </div>

                <div className={classes.contents}>
                  <FeatureTable
                    metrics={!loading && data
                      ? data
                        .sort((row1, row2) => new Date(row2.createdAt).getTime()
                          - new Date(row1.createdAt).getTime())
                        .filter((row) => (selectedCategory !== '전체'
                          ? row.category === selectedCategory : row))
                      : []}
                    handleClick={handleFeatureClick}
                    page={page}
                    pageSize={pageSize}
                    handlePage={setPage}
                    handlePageSize={setPageSize}
                    categoryTabSwitch={categoryTabSwitch}
                  />
                </div>
                <div>
                  {authContext.user.userId ? (
                    <Button
                      onClick={handleWriteClick}
                    >
                      글쓰기
                    </Button>
                  ) : null}
                </div>
              </>
            )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
