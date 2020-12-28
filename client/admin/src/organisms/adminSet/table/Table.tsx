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

/* 
  Props 
  **************************************************************************************************
  컴포넌트에 사용되는 interface -> 부모컴포넌트로 해당 인터페이스에 정의된 속성들을 전달받아야합니다.
  **************************************************************************************************
  tableData : table에 랜더링되는 데이터에대한 props , 부모컴포넌트에서 tableData와 일치되는 타입의 데이터를 전달받습니다. 
  handleData : table의 행을 클릭시 detail component에 전달될 데이터를 선택하는 핸들러함수를 전달받습니다. 
  handleEditModeOff : table 행 클릭시 글 편집 모드를 종료하는 핸들러함수를 전달받습니다.
  **************************************************************************************************
  by emma.sangeun
  */
interface Props {
  tableData: any;
  handleEditModeOff: () => void;
  handleData: (Data: any) => void;
}

/*
  localization
  *****************************************************************************************************
  material table의 customizing을 위한 속성값 정의, 테이블의 레이아웃을 조정합니다.
  ******************************************************************************************************
  body : 테이블 바디에 데이터가 없는경우 , 툴팁에대한 정의입니다. 바디 레이아웃을 변경하고 싶다면 이 값을 조절하여 변경할 수 있습니다.
  grouping : 
  pagination : 페이지네이션 레이아웃을 변경하고 싶다면 이값을 조절하여 변경할 수 있습니다.
  header : 
  toolbar : toolbar 부분의 레이아웃을 변경하고 싶다면 이값을 조절하여 변경할 수 있습니다.
  ******************************************************************************************************
  */
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

/*
    *****************************************************************************************************
    Table
    *****************************************************************************************************
    공지사항 게시글 목록을 관리하는 테이블입니다.
    rowClick (o)
    행을 클릭시 해당 행의 선택된 데이터에대한 detail 컴포넌트가 랜더링 됩니다.
    *****************************************************************************************************
    column :
      - 글번호 : 공지사항 글번호 (tableData.id)_number
      - 카테고리 : 공지사항글의 카테고리 (tableData.category)_string
      - 중요공지 : 중요공지 여부 (tableData.isImportant)_boolean
      - 글제목 : 공지사항 글의 제목 (tableData.title)_string
      - 작성자 : 공지사항 글의 작성자 (tableData.author)_string
    *****************************************************************************************************
    */
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
