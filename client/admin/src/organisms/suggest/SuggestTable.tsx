import React, { forwardRef } from 'react';
import { Typography, useMediaQuery } from '@material-ui/core';
import { FiberNew } from '@material-ui/icons';
import MaterialTable from 'material-table';
import {
  Check, Clear, Delete, FilterList, FirstPage, ViewColumn,
  LastPage, ChevronRight, ChevronLeft, ArrowUpward, Search,
} from '@material-ui/icons';

const tableIcons = {
  Check: forwardRef((props: any, ref) => <Check {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props: any, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props: any, ref) => <Clear {...props} ref={ref} />),
  ResetSearch: forwardRef((props: any, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props: any, ref) => <Delete {...props} ref={ref} />),
  Filter: forwardRef((props: any, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props: any, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props: any, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props: any, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props: any, ref) => <ChevronLeft {...props} ref={ref} />),
  SortArrow: forwardRef((props: any, ref) => <ArrowUpward {...props} ref={ref} />),
  Search: forwardRef((props: any, ref) => <Search {...props} ref={ref} />),
  ViewColumn: forwardRef((props: any, ref) => <ViewColumn {...props} ref={ref} />),
  DetailPanel: forwardRef((props: any, ref) => <ChevronRight {...props} ref={ref} />),
};

//최신일을 계산해주는 함수
function dateDiff(date1: any, date2: any) {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

interface props {
  suggestData: any;
  handleEditModeOff: () => void; 
     handleData: (Data: any) => void;
}

//table 레이아웃조정
const localization = {
  body: {
    deleteTooltip: '캠페인 삭제',
    emptyDataSourceMessage: '해당하는 데이터가 없습니다.',
  },
  grouping: {
    placeholder: '묶을 컬럼의 헤더를 끌어주세요.',
  },
  pagination: {
    firstTooltip: '첫 페이지',
    previousTooltip: '이전 페이지',
    nextTooltip: '다음 페이지',
    lastTooltip: '마지막 페이지',
    labelRowsSelect: '행',
  },
  header: {
    actions: '',
  },
  toolbar: {
    searchTooltip: '',
    searchPlaceholder: '검색어를 입력하세요..',
  },
};

//기능제안 목록 테이블
export default function SuggestTable(props: props) {
  const { suggestData, handleData, handleEditModeOff } = props;
  const isMdWidth = useMediaQuery('(min-width:1200px)');

  return (
    <MaterialTable
      title="기능 제안"
      columns={[
        { title: '카테고리', field: 'category', render: rowData => (<Typography>{rowData.category}</Typography>) },
        {
          title: '제목',
          field: 'title',
          render: rowData => (
            <Typography className="title">
              {true ? ("[신규 제안]") : ""}
              {rowData.title}
              { dateDiff(new Date(), new Date(rowData.createdAt)) < 8 && (
              <FiberNew style={{ color: '#929ef8' }}/>
              )}
            </Typography>
          ),
        },
        {
          title: '작성일',
          field: 'createdAt',
          render: rowData => (
            <Typography>{new Date(rowData.createdAt).toLocaleString()}</Typography>
          ),
        },
        {
          title: '작성자',
          field: 'author',
          render: rowData => (
            <Typography>{rowData.author}</Typography>
          ),
        },
        {
          title: '진행상태',
          field: 'state',
          render: rowData => (
          <Typography className="상태">{rowData.state}</Typography>
          )
        },
        {
          title: '좋아요',
          field: 'like',
          render: rowData => (
          <Typography className="상태">{rowData.like}</Typography>
          )
        },
        
      ]}
      data={suggestData}
      onRowClick={(e, rowData: any) => {
          handleData(rowData);
          handleEditModeOff();
      }}
      options={{
        search: true,
        pageSize: isMdWidth ? 15 : 5,
        pageSizeOptions: [5, 10, 15],
        rowStyle: {
          height: 65,
        },
        headerStyle: { backgroundColor: '#f5f5f5', color: '#555555' },
        searchFieldAlignment: 'right',     
      }}
      localization={localization}
      icons={tableIcons}
    />
  );
}