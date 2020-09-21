import React from 'react';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ProductHero from '../../organisms/mainpage/shared/ProductHero';
import Appbar from '../../organisms/shared/Appbar';
import NoticeTable from '../../organisms/mainpage/notice/NoticeTable';
import NoticeCategoryButtonGroup from '../../organisms/mainpage/notice/NoticeCategoryButtonGroup';
import NoticeDetail from '../../organisms/mainpage/notice/NoticeDetail';
import { NoticeData } from '../../interfaces/Notice';

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

export default function Notice():JSX.Element {
  const classes = useStyles();

  // Data loading
  const [{ loading, data }] = useAxios<NoticeData[]>({
    url: '/notice', method: 'GET',
  });

  // Category 선택을 위한 스테이트 
  const [selectedCategory, setSelectedCategory] = React.useState<string>('전체');
  function handleCategorySelect(str: string):void {
    setSelectedCategory(str);
  }

  // 선택된 개별 공지사항 글을 보여주기 위한 스테이트
  const [selectedNoticeId, setSelectedNoticeId] = React.useState<number>();
  function handleNoticeClick(num: number):void {
    setSelectedNoticeId(num);
  }
  function handleResetNoticeSelect(): void {
    setSelectedNoticeId(undefined);
  }

  return (
    <main>
      <Appbar />
      <ProductHero
        title="여러분의 기능제안을 기다립니다."
        content="트루포인트 이용 중 추가되었으면 하는 기능이나 개선이 필요한 기능이 있따면 기능제안 게시판을 통해 제안해주세요."
      />
      <section className={classes.noticeSection}>
        <div className={classes.noticeContainer}>
          <Typography variant="h4">공지사항</Typography>

          {selectedNoticeId ? (
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
                  .filter((row) => (selectedCategory !== '전체' ? row.category === selectedCategory : row))}
                onOtherNoticeClick={handleNoticeClick}
                onBackClick={handleResetNoticeSelect}
              />
            </div>
          ) : (
            <>
              <div className={classes.contents}>
                <NoticeCategoryButtonGroup
                  categories={!loading && data
                    ? Array.from(new Set(data.map((d) => d.category)))
                    : []}
                  onChange={handleCategorySelect}
                  selected={selectedCategory}
                />
              </div>

              <div className={classes.contents}>
                <NoticeTable<NoticeData>
                  data={!loading && data
                    ? data
                      .sort((row1, row2) => {
                        if (row2.isImportant) return 1;
                        if (row1.isImportant) return -1;
                        return new Date(row2.createdAt).getTime()
                            - new Date(row1.createdAt).getTime();
                      })
                      .filter((row) => (selectedCategory !== '전체' ? row.category === selectedCategory : row))
                    : []}
                  onRowClick={handleNoticeClick}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
