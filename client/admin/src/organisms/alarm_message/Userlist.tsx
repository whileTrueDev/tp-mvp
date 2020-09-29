import React, { forwardRef } from 'react';
import { useMediaQuery, Button } from '@material-ui/core';
import MaterialTable from 'material-table';
import {
  Check, Clear, Delete, FilterList, FirstPage, ViewColumn,
  LastPage, ChevronRight, ChevronLeft, ArrowUpward, Search
} from '@material-ui/icons';
import AvatarWithName from './AvatarWithName';
//massage Form
import DualMessageForm from './AllTransmisisonForm';

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


interface Props {
  userData: any;
  handleClick: (event: any, d: any) => void; 
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
export default function UserlistTable(props: Props) {
  
  const { userData, handleClick } = props;
  const [list, setList] = React.useState([]);

  //DialogOpen
  const [open, setOpen] = React.useState(false);

  //handleOpen(v: boolean) => void;
  function handleOpen() {
    var v=true
    setOpen(v);
  }
  //handleClose()=>void;
  function handleClose() {
    setOpen(false);
  }
  
  const isMdWidth = useMediaQuery('(min-width:1200px)');

  return (
    <>
    <Button
      variant = "contained"
      color="primary"
      onClick={handleOpen}
    >
        체크한 인원에 대한 일괄전송 내용작성
      </Button>
    <MaterialTable
      title="회원 목록"
      columns={[
        { title: '사용자', field: 'userName', render: rowData => (
          <AvatarWithName name={rowData.userName} logo={null} />
        ) },
      ]}
      data={userData}
      onRowClick={(e, rowData: any) => {
          handleClick(e, rowData);
      }}
      onSelectionChange={(rowData: any) => {
        setList(rowData);
      }}
      options={{
        search: true,
        pageSize: isMdWidth ? 15 : 5,
        pageSizeOptions: [5, 10, 15],
        rowStyle: {
          height: 65,
        },
        selection: true,
        headerStyle: { backgroundColor: '#f5f5f5', color: '#555555' },
        searchFieldAlignment: 'right',     
      }}
      localization={localization}
      icons={tableIcons}
    />
     <DualMessageForm
        list={list} 
        open={open} 
        handleOpen={handleOpen} 
        handleClose={handleClose}
        setList={setList}  
      />
  </>
  );
}