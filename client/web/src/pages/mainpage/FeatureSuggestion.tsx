import React from 'react';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';

import Appbar from '../../organisms/shared/Appbar';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import FeatureTable from '../../organisms/mainpage/featureSuggestion/FeatureTable';
import FeatureCategoryButtonGroup from '../../organisms/mainpage/featureSuggestion/FeatureCategoryButtonGroup';
import FeatureDetail from '../../organisms/mainpage/featureSuggestion/FeatureDetail';
import { FeatureData } from '../../interfaces/Feature';

const useStyles = makeStyles((theme) => ({
  noticeSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noticeContainer: { width: 1400, margin: '100px auto', minHeight: 900 },
  contents: { marginTop: theme.spacing(4) },
}));

export default function FeatureSuggestion(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const { id: selectedNoticeId } = useParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('전체');
  function handleCategorySelect(str: string): void {
    setSelectedCategory(str);
  }

  function handleNoticeClick(num: number): void {
    history.push(`/feature-suggestion/${num}`);
  }
  function handleResetNoticeSelect(): void {
    history.push('/feature-suggestion');
  }

  const [{ loading, data }] = useAxios<FeatureData[]>({
    url: '/feature', method: 'GET'
  });

  console.log(data);
  return (
    <div>
      {/* <Appbar /> */}
      <ProductHero
        title="기능제안"
        content="기능 개선과 제안된 기능을 도입하기 위해 끊임없이 연구하고 있습니다."
      />
      <section className={classes.noticeSection}>
        <div className={classes.noticeContainer}>
          <Typography variant="h4">기능제안</Typography>

          {/* 공지사항 개별 보기 */}
          {selectedNoticeId && !loading && data ? (
            <div className={classes.contents}>
              <FeatureDetail
                selectedNoticeId={selectedNoticeId}
                data={data
                  .sort((row1, row2) => new Date(row2.createdAt).getTime()
                    - new Date(row1.createdAt).getTime())
                  .filter((row) => (selectedCategory !== '전체' ? row.category === selectedCategory : row))}
                onOtherNoticeClick={handleNoticeClick}
                onBackClick={handleResetNoticeSelect}
              />
            </div>
          ) : (
              <>
                {/* 공지사항 목록 보기 */}
                <div className={classes.contents}>
                  <FeatureCategoryButtonGroup
                    categories={!loading && data
                      ? Array
                        .from(new Set(data.map((d) => d.category)))
                        .sort((x, y) => x.localeCompare(y))
                      : []}
                    onChange={handleCategorySelect}
                    selected={selectedCategory}
                  />
                </div>

                <div className={classes.contents}>
                  <FeatureTable<FeatureData>
                    data={!loading && data
                      ? data
                        .sort((row1, row2) => new Date(row2.createdAt).getTime()
                          - new Date(row1.createdAt).getTime())
                        .filter((row) => (selectedCategory !== '전체' ? row.category === selectedCategory : row))
                      : []}
                    onRowClick={handleNoticeClick}
                  />
                </div>
              </>
            )}
        </div>
      </section>
    </div>
  );
}
