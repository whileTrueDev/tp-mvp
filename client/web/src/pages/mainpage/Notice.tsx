import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useHistory, useParams } from 'react-router-dom';
import { Notice as NoticeData } from '@truepoint/shared/dist/interfaces/Notice.interface';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import Appbar from '../../organisms/shared/Appbar';
import NoticeTable from '../../organisms/mainpage/notice/NoticeTable';
import FilterCategoryButtonGroup from '../../organisms/mainpage/shared/FilterCategoryButtonGroup';
import NoticeDetail from '../../organisms/mainpage/notice/NoticeDetail';
import Footer from '../../organisms/shared/footer/Footer';
import useScrollTop from '../../utils/hooks/useScrollTop';
import NoticeLayout, { useContainerStyles } from '../../organisms/mainpage/shared/NoticeLayout';

export default function Notice(): JSX.Element {
  const classes = useContainerStyles();
  const history = useHistory();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(8);
  // Notice number Param
  const { id: selectedNoticeId } = useParams<{ id: string}>();

  // Data loading
  const [{ loading, data }] = useAxios<NoticeData[]>({
    url: '/notice', method: 'GET',
  });

  // Category 선택을 위한 스테이트 
  const [selectedCategory, setSelectedCategory] = React.useState<string>('전체');
  function handleCategorySelect(str: string): void {
    setSelectedCategory(str);
  }

  // 선택된 개별 공지사항 글을 보여주기 위한 스테이트
  function handleNoticeClick(num: number): void {
    history.push(`/notice/${num}`);
  }
  function handleResetNoticeSelect(): void {
    history.push('/notice');
    setSelectedCategory('전체'); // 목록으로 돌아온 경우 카테고리 선택 "전체"로 변경
  }

  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동
  useScrollTop();
  useEffect(() => {
    // 선택된 공지사항 Id 변경시 스크롤 최상단으로
    window.scrollTo(0, 0);
  }, [selectedNoticeId]);
  return (
    <main>
      <Appbar variant="transparent" />
      <ProductHero />
      <NoticeLayout
        title="공지사항"
        description="기능개선과 제안된 기능을 도입하기 위해 끊임없이 연구하고 있습니다."
      >
        {/* 공지사항 개별 보기 */}
        {selectedNoticeId && !loading && data && (
        <div className={classes.contents}>
          <NoticeDetail
            selectedNoticeId={selectedNoticeId}
            data={data
              .sort((row1, row2) => {
                if (row2.isImportant) return 1;
                if (row1.isImportant) return -1;
                return new Date(row2.createdAt).getTime()
                      - new Date(row1.createdAt).getTime();
              })
              .filter((row) => (selectedCategory !== '전체'
                ? row.category === selectedCategory : row))}
            onOtherNoticeClick={handleNoticeClick}
            onBackClick={handleResetNoticeSelect}
          />
        </div>
        )}
        {/* 공지사항 카테고리 필터링 목록 보기 */}
        {!selectedNoticeId && (
          <div className={classes.contents}>
            <FilterCategoryButtonGroup
              categories={!loading && data
                ? Array
                  .from(new Set(data.map((d) => d.category)))
                  .sort((x, y) => x.localeCompare(y))
                : []}
              onChange={handleCategorySelect}
              selected={selectedCategory}
            />
          </div>
        )}

        <div className={classes.contents}>
          <NoticeTable
            isLoading={loading}
            metrics={!loading && data
              ? data
                .sort((row1, row2) => {
                  if (row2.isImportant) return 1;
                  if (row1.isImportant) return -1;
                  return new Date(row2.createdAt).getTime()
                    - new Date(row1.createdAt).getTime();
                })
                .filter((row) => (selectedCategory !== '전체'
                  ? row.category === selectedCategory : row))
              : []}
            handleClick={handleNoticeClick}
            page={page}
            pageSize={pageSize}
            handlePage={setPage}
            handlePageSize={setPageSize}
          />
        </div>
      </NoticeLayout>
      <Footer />
    </main>
  );
}
