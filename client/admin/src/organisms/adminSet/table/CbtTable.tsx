import React, { forwardRef } from 'react';
import { Typography, useMediaQuery, Button } from '@material-ui/core';
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

// cbtTable 함수의 props
interface Props {
  tableData: any;
  // handleEditModeOff: () => void;
  handleOpen: () => void;
  handleData: (Data: any) => void;
  asignState: boolean;
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

export default function CbtTable(props: Props): JSX.Element {
  const {
    tableData, handleOpen, handleData, asignState,
  } = props;
  const isMdWidth = useMediaQuery('(min-width:1200px)');

  return (
    <MaterialTable
      title="공지사항"
      icons={tableIcons}
      columns={[
        {
          title: '가입관리',
          field: 'register',
          render: (rowData) => (
            <Button
              disabled={asignState}
              color="secondary"
              variant="contained"
              onClick={() => {
                handleOpen();
                handleData(rowData);
              }}
            >
              가입
            </Button>
          ),
        },
        { title: '이름', field: 'name', render: (rowData) => (<Typography>{rowData.name}</Typography>) },
        { title: '신청 Id', field: 'idForTest', render: (rowData) => (<Typography>{rowData.idForTest}</Typography>) },
        { title: '활동명', field: 'creatorName', render: (rowData) => (<Typography>{rowData.creatorName}</Typography>) },
        {
          title: 'email',
          field: 'email',
          render: (rowData) => (
            <Typography className="title">
              {rowData.email}
            </Typography>
          ),
        },
        {
          title: '플랫폼',
          field: 'platform',
          render: (rowData) => (
            <Typography>{rowData.platform}</Typography>
          ),
        },
        {
          title: '휴대전화',
          field: 'phoneNum',
          render: (rowData) => (
            <Typography>{rowData.phoneNum}</Typography>
          ),
        },
        {
          title: '진행상태',
          field: 'isComplete',
          render: (rowData) => (
            <Typography>{rowData.isComplete}</Typography>
          ),
        },
      ]}
      data={tableData}
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
