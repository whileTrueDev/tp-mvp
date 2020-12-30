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

/* 
  Props 
  **************************************************************************************************
  컴포넌트에 사용되는 interface -> 부모컴포넌트로 해당 인터페이스에 정의된 속성들을 전달받아야합니다.
  **************************************************************************************************
  tableData : table에 랜더링되는 데이터에대한 props , 부모컴포넌트에서 tableData와 일치되는 타입의 데이터를 전달받습니다. 
  handleOpen : 가입시키기 버튼 클릭시 dialog가 열리는 핸들러를 전달받습니다.
  handleData : 가입시키기 버튼 클릭시 dialog에 선택된 행의 신청자 데이터 를 전달하는 핸들러를 전달받습니다.
  **************************************************************************************************
  */
interface Props {
  tableData: any;
  handleOpen: () => void;
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
    CbtTable
    *****************************************************************************************************
    <개요>
    cbt 회원가입 신청을 희망하는 신청자의 목록을 보여주는 table component입니다.
    rowClick x
    행마다 가입관리 버튼 클릭시 다이얼로그가 나타나 회원가입을 진행합니다.
    가입완료시 typography 컴포넌트가 랜더링 됩니다.
    *****************************************************************************************************
    column :
      - 가입관리 : isComplete값에 따라 가입완료(typography) or 가입시키기(button)
      - 이름 : 신청자 이름 (tableData.name)_string
      - 신청 Id : 신청자가 사용하길 원하는 truepoint Id (tableData.idForTest)_string
      - 활동명 : 신청자의 크리에이터 활동명 (tableData.creatorName)_string
      - email : 신청자 이메일주소 (tableData.email)_string
      - platform : 신청 플랫폼 (tableData.platform)_string
      - 휴대전화 : 신청자 휴대전화 번호 (tableData.phoneNum)_string
      - 진행상태 : 회원가입의 진행상태 완료시 true, 미완료시 false (tableData.isComplete)_boolean
    *****************************************************************************************************
    */
export default function CbtTable(props: Props): JSX.Element {
  const {
    tableData, handleOpen, handleData,
  } = props;
  const isMdWidth = useMediaQuery('(min-width:1200px)');

  return (

    <MaterialTable<any>
      title="공지사항"
      icons={tableIcons}
      columns={[
        {
          title: '가입관리',
          field: 'register',
          render: (rowData) => (
            <div>
              {rowData.isComplete ? (
                <Typography>가입완료</Typography>
              ) : (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    handleOpen();
                    handleData(rowData);
                  }}
                >
                  가입시키기
                </Button>
              )}
            </div>
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
            <Typography>{rowData.isComplete ? '가입완료' : '가입 미완료'}</Typography>
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
