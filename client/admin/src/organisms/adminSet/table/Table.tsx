import React, { forwardRef } from 'react';
import { Typography, useMediaQuery } from '@material-ui/core';
import {

  Check, Clear, Delete, FilterList, FirstPage, ViewColumn,
  LastPage, ChevronRight, ChevronLeft, ArrowUpward, Search,
} from '@material-ui/icons';
import MaterialTable, { Icons } from 'material-table';

const tableIcons: Icons = {
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

// noticeTable 함수의 props
interface Props {
  tableData: any;
  handleEditModeOff: () => void;
  handleData: (Data: any) => void;
}

// table 레이아웃조정
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

export default function Table(props: Props): JSX.Element {
  const { tableData, handleData, handleEditModeOff } = props;
  const isMdWidth = useMediaQuery('(min-width:1200px)');

  return (
    <MaterialTable
      title="공지사항"
      icons={tableIcons}
      columns={[
        { title: '글번호', field: 'id', render: (rowData) => (<Typography>{rowData.id}</Typography>) },
        { title: '카테고리', field: 'category', render: (rowData) => (<Typography>{rowData.category}</Typography>) },
        { title: '중요공지', field: 'isImportant', render: (rowData) => (<Typography>{rowData.isImportant ? ('[중요]') : '[일반]'}</Typography>) },
        {
          title: '글제목',
          field: 'title',
          render: (rowData) => (
            <Typography className="title">
              {rowData.title}
            </Typography>
          ),
        },
        {
          title: '작성자',
          field: 'author',
          render: (rowData) => (
            <Typography>{rowData.author}</Typography>
          ),
        },
      ]}
      data={tableData}
      onRowClick={(e, rowData) => {
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
    />
  );
}