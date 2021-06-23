import React, { forwardRef } from 'react';
import { Typography, useMediaQuery } from '@material-ui/core';
import {
  FiberNew,
  Check, Clear, Delete, FilterList, FirstPage, ViewColumn,
  LastPage, ChevronRight, ChevronLeft, ArrowUpward, Search,
} from '@material-ui/icons';
import MaterialTable, { Icons } from 'material-table';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';

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

// 최신일을 계산해주는 함수
function dateDiff(date1: any, date2: any) {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

/* 
  SuggestTableProps 
  **************************************************************************************************
  컴포넌트에 사용되는 interface -> 부모컴포넌트로 해당 인터페이스에 정의된 속성들을 전달받아야합니다.
  **************************************************************************************************
  tableData : table에 랜더링되는 데이터에대한 props , 부모컴포넌트에서 tableData와 일치되는 타입의 데이터를 전달받습니다. 
  handleData : table의 행을 클릭시 detail component에 전달될 데이터를 선택하는 핸들러함수를 전달받습니다. 
  ReplyPostModeOff : 답글작성모드를 off 하는 핸들러함수를 전달받습니다.
  handleReplyModeOff : 답글작성을 off 하는 핸들러함수를 전달받습니다.
  setSuggestionId : 기능제안글의 id값을 선택하는 핸들러함수를 전달받습니다.
  handleSuggestionId : 기능제안글의 id값을 선택하는 핸들러함수를 전달받습니다.
  **************************************************************************************************
  */
interface SuggestTableProps {
  tableData?: FeatureSuggestion[];
  handleData: (Data: any) => void;
  ReplyPostModeOff: () => void;
  handleReplyModeOff: () => void;
  setSuggestionId: (id: any) => void;
  handleSuggestionId: (v: any) => void;
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

  by emma.sangeun
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
    SuggestTable
    *****************************************************************************************************
    <개요>
    1. 기능제안글의 목록을 관리하고 보여주는 테이블입니다.
    2. rowClick (o)
    3. 행을 클릭시 답글 detail 컴포넌트를 랜더링 시켜 세부사항을 확인하고, 수정, 삭제 상태관리를 관리하는작업을 할 수 있도록 해줍니다.
    4. 해당 Table에서 관리자가 다른 행을 클릭하면 다른 답글에대한 3번의 과정이 진행되어야하므로, offhandler를 통해 수정및 편집모드는 무조건 off됩니다.
    *****************************************************************************************************
    column :
      - 제목 : 기능제안글의 제목 (tableData.title)_string
      - 작성일 : 기능제안글의 생성일 (tableData.createdAt)_string
      - 작성자 : 기능제안글의 작성자 (tableData.userId)_string
      - 진행상태 Id : 기능제안에대한 작업처리 진행상태 (tableData.state)_number
      - 좋아요 : 해당기능제안 글에대한 좋아요수 (tableData.liek)_number
    *****************************************************************************************************
    */
export default function SuggestTable(props: SuggestTableProps): JSX.Element {
  const {
    tableData, handleData, ReplyPostModeOff, handleReplyModeOff, setSuggestionId, handleSuggestionId,
  } = props;
  const isMdWidth = useMediaQuery('(min-width:1200px)');

  function handleState(Case: number) {
    switch (Case) {
      case 0:
        return '미확인';
      case 1:
        return '검토중';
      case 2:
        return '개발확정';
      case 3:
        return '개발보류';
      default:
        return '';
    }
  }

  return (
    <MaterialTable
      title="기능 제안"
      columns={[
        {
          title: '카테고리',
          field: 'category',
          render: (rowData) => {
            const { category } = rowData;
            return (<Typography>{category}</Typography>);
          },
        },
        {
          title: '제목',
          field: 'title',
          render: (rowData) => {
            const { title, createdAt } = rowData;
            return (
              <Typography className="title">
                [신규 제안]
                {title}
                { dateDiff(new Date(), new Date(createdAt)) < 8 && (
                <FiberNew style={{ color: '#929ef8' }} />
                )}
              </Typography>
            );
          },
        },
        {
          title: '작성일',
          field: 'createdAt',
          render: (rowData) => {
            const { createdAt } = rowData;
            return (
              <Typography>{new Date(createdAt).toLocaleString()}</Typography>
            );
          },
        },
        {
          title: '작성자',
          field: 'author',
          render: (rowData) => {
            const { author, userIp } = rowData;

            let content: string;
            if (author) {
              const { userId, nickName } = author;
              content = `${userId} ${nickName}`;
            } else {
              content = `${userIp}`;
            }

            return (
              <Typography>{`${content}`}</Typography>
            );
          },
        },
        {
          title: '진행상태',
          field: 'state',
          render: (rowData) => {
            const { state } = rowData;
            return (
              <Typography className="상태">{handleState(state)}</Typography>
            );
          },
        },
      ]}
      data={tableData || []}
      onRowClick={(e, rowData: any) => {
        handleData(rowData);
        ReplyPostModeOff();
        handleReplyModeOff();
        handleSuggestionId(rowData.suggestionId);
        setSuggestionId(rowData.suggestionId);
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
