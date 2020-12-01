import React from 'react';
import useAxios from 'axios-hooks';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Notice as NoticeData } from '@truepoint/shared/dist/interfaces/Notice.interface';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import Appbar from '../../organisms/shared/Appbar';
import NoticeTable from '../../organisms/mainpage/notice/NoticeTable';
import FilterCategoryButtonGroup from '../../organisms/mainpage/shared/FilterCategoryButtonGroup';
import NoticeDetail from '../../organisms/mainpage/notice/NoticeDetail';
import Footer from '../../organisms/shared/footer/Footer';

const useStyles = makeStyles((theme) => ({
  noticeSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeContainer: {
    width: 968, margin: '64px auto',
  },
  contents: { marginTop: theme.spacing(2) },
}));

export default function Notice(): JSX.Element {
  const classes = useStyles();
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

  return (
    <main>
      <Appbar />
      <ProductHero
        title="공지사항"
        content="기능 개선과 제안된 기능을 도입하기 위해 끊임없이 연구하고 있습니다."
      />
      <section className={classes.noticeSection}>
        <div className={classes.noticeContainer}>
          <Typography variant="h4">공지사항</Typography>

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
        </div>
      </section>
      <Footer />
    </main>
  );
}
