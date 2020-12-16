import React, { useEffect } from 'react';
import classnames from 'classnames';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Chip, CircularProgress, Paper,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import FeatureTable from '../../organisms/mainpage/featureSuggestion/FeatureTable';
import FilterCategoryButtonGroup from '../../organisms/mainpage/shared/FilterCategoryButtonGroup';
import FeatureDetail from '../../organisms/mainpage/featureSuggestion/FeatureDetail';
import Button from '../../atoms/Button/Button';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import useAuthContext from '../../utils/hooks/useAuthContext';
import useScrollTop from '../../utils/hooks/useScrollTop';

const useStyles = makeStyles((theme) => ({
  featureSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContainer: { width: 968, margin: '64px auto' },
  contents: { marginTop: theme.spacing(2) },
  buttonSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipArea: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  detailLoading: {
    height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
  },
  tableContainer: { marginTop: theme.spacing(1) },
}));

export default function FeatureSuggestionPage(): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();
  const history = useHistory();
  const { id: selectedSuggestionId } = useParams<{ id: string }>();

  // 카테고리 필터링
  const [selectedCategory, setSelectedCategory] = React.useState<string>('전체');
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
    // "목록" 버튼 클릭으로 목록으로 돌아온 경우 "전체" 카테고리로 수정
    setSelectedCategory('전체');
  }

  // ******************************************************************
  // 데이터 요청
  const [{ loading, data: featureListData }, featureListRefetch] = useAxios<Omit<FeatureSuggestion, 'content' | 'replies'>[]>({
    url: '/feature-suggestion/list', method: 'GET',
  });

  // ******************************************************************
  // 기능제아 데이터 요청 (글쓰기 -> 목록으로 돌아와도 새로운 기능제안을 재 요청하지 않는 현상을 수정하기 위해.)
  useEffect(() => {
    featureListRefetch();
  }, [featureListRefetch]);

  // 페이지네이션
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(8);
  // 시작시 화면 최상단으로 고정
  useScrollTop();
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
          {selectedSuggestionId && loading && (
            <Paper elevation={0} className={classes.detailLoading}>
              <CircularProgress />
            </Paper>
          )}
          {selectedSuggestionId && !loading && featureListData && (
            <div className={classes.contents}>
              <FeatureDetail
                selectedSuggestionId={selectedSuggestionId}
                data={featureListData
                  .sort((row1, row2) => new Date(row2.createdAt).getTime()
                    - new Date(row1.createdAt).getTime())
                  .filter((row) => (selectedCategory !== '전체'
                    ? row.category === selectedCategory : row))}
                onOtherFeatureClick={handleFeatureClick}
                onBackClick={handleResetFeatureSelect}
                featureListRefetch={featureListRefetch}
              />
            </div>
          )}

          {/* 기능제안 카테고리 목록 필터링 */}
          {!selectedSuggestionId && (
            <div className={classes.contents}>
              <FilterCategoryButtonGroup
                categories={!loading && featureListData
                  ? Array
                    .from(new Set(featureListData.map((d) => d.category)))
                    .sort()
                  : []}
                onChange={handleCategorySelect}
                selected={selectedCategory}
              />
            </div>
          )}

          {/* 기능제안 글 목록 */}
          <div className={classnames(classes.contents, classes.buttonSection)}>
            <div>
              {authContext.user.userId && (
                <Button onClick={handleWriteClick}>
                  글쓰기
                </Button>
              )}
            </div>
            <div className={classes.chipArea}>
              <Chip style={{ margin: 4 }} variant="outlined" label="미확인" />
              <Chip style={{ margin: 4 }} color="secondary" label="개발 확정" />
              <Chip style={{ margin: 4 }} color="primary" label="개발보류" />
            </div>
          </div>
          <div className={classes.tableContainer}>
            <FeatureTable
              isLoading={loading}
              metrics={!loading && featureListData
                ? featureListData
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
            />

          </div>
        </div>
      </section>
      <Footer />

    </div>
  );
}
