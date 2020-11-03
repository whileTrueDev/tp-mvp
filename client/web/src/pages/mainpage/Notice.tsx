import React from 'react';
import useAxios from 'axios-hooks';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import Appbar from '../../organisms/shared/Appbar';
import NoticeTable from '../../organisms/mainpage/notice/NoticeTable';
import NoticeCategoryButtonGroup from '../../organisms/mainpage/notice/NoticeCategoryButtonGroup';
import NoticeDetail from '../../organisms/mainpage/notice/NoticeDetail';
import { NoticeData } from '../../interfaces/Notice';
import Footer from '../../organisms/shared/footer/Footer';

const useStyles = makeStyles((theme) => ({
  noticeSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeContainer: { width: 1400, margin: '100px auto', minHeight: 900 },
  contents: { marginTop: theme.spacing(4) },
}));

export default function Notice(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  // Notice number Param
  const { id: selectedNoticeId } = useParams<{ id: string}>();
  // 개별 글 보기 스크롤 아래로 내리기
  const noticeContainerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (selectedNoticeId) {
      if (noticeContainerRef
        && noticeContainerRef.current
        && noticeContainerRef.current.scrollHeight) {
        window.scrollTo(0, noticeContainerRef.current.scrollHeight - 100);
      } else {
        window.scrollTo(0, 600);
      }
    }
  }, [selectedNoticeId]);

  // Data loading
  const [{ loading, data }] = useAxios<NoticeData[]>({
    url: '/notice', method: 'GET',
  });
  const noticeTabSwitch = (value: string | undefined) => {
    switch (value) {
      case '0': return (<Typography> 업데이트 </Typography>);
      case '1': return (<Typography> 서버점검 </Typography>);
      case '2': return (<Typography> 기타 </Typography>);
      default: return (<Typography> 전체 </Typography>);
    }
  };

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
  }

  return (
    <main>
      <Appbar />
      <ProductHero
        title="공지사항"
        content="기능 개선과 제안된 기능을 도입하기 위해 끊임없이 연구하고 있습니다."
      />
      <section className={classes.noticeSection}>
        <div className={classes.noticeContainer} ref={noticeContainerRef}>
          <Typography variant="h4">공지사항</Typography>

          {/* 공지사항 개별 보기 */}
          {selectedNoticeId && !loading && data ? (
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
                noticeTabSwitch={noticeTabSwitch}
              />
            </div>
          ) : (
            <>
              {/* 공지사항 목록 보기 */}
              <div className={classes.contents}>
                <NoticeCategoryButtonGroup
                  categories={!loading && data
                    ? Array
                      .from(new Set(data.map((d) => d.category)))
                      .sort((x, y) => x.localeCompare(y))
                    : []}
                  onChange={handleCategorySelect}
                  selected={selectedCategory}
                  noticeTabSwitch={noticeTabSwitch}
                />
              </div>

              <div className={classes.contents}>
                <NoticeTable
                  metrics={!loading && data
                    ? data
                      .sort((row1, row2) => new Date(row2.createdAt).getTime()
                          - new Date(row1.createdAt).getTime())
                      .filter((row) => (selectedCategory !== '전체'
                        ? row.category === selectedCategory : row))
                    : []}
                  handleClick={handleNoticeClick}
                  page={page}
                  pageSize={pageSize}
                  handlePage={setPage}
                  handlePageSize={setPageSize}
                  categoryTabSwitch={noticeTabSwitch}
                />
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
