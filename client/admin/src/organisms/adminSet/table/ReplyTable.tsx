import React, { forwardRef } from 'react';
import { Typography, useMediaQuery } from '@material-ui/core';
import {
  Check, Clear, Delete, FilterList, FirstPage, ViewColumn,
  LastPage, ChevronRight, ChevronLeft, ArrowUpward, Search,
} from '@material-ui/icons';
import MaterialTable, { Icons } from 'material-table';
import { FeatureSuggestionReply } from '@truepoint/shared/dist/interfaces/FeatureSuggestionReply.interface';

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
  replyData : table에 랜더링되는 데이터에대한 props , 부모컴포넌트에서 tableData와 일치되는 타입의 데이터를 전달받습니다. 
  handleReplyData : table의 행을 클릭시 detail component에 전달될 데이터를 선택하는 핸들러함수를 전달받습니다.
  handleReplyEditModeOff : 답글 수정,작성 하는 컴포넌트를 랜더링하지 않도록하는 핸들러함수를 전달받습니다.
  **************************************************************************************************
  by emma.sangeun
  */
interface ReplyTableProps {
  replyData?: FeatureSuggestionReply[];
  handleReplyData: (Data: any) => void;
  handleReplyEditModeOff: () => void;
  selectedSuggestionId: string;
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
    ReplyTable
    *****************************************************************************************************
    <개요>
    1. 1개의 기능제안글에 달린 답글목록을 관리하고 보여주는 테이블입니다.
    2. rowClick (o)
    3. 행을 클릭시 답글 detail 컴포넌트를 랜더링 시켜 답변에 세부사항을 확인하고, 수정, 삭제 상태관리를 관리하는작업을 할 수 있도록 해줍니다.
    4. 해당 ReplyTable에서 관리자가 다른 행을 클릭하면 다른 답글에대한 3번의 과정이 진행되어야하므로, offhandler를 통해 수정및 편집모드는 무조건 off됩니다.
    *****************************************************************************************************
    column :
      - 기능제안 글번호 : 기능제안글의 id (기능제안글 작성자 id 아님) (tableData.suggestionId)_string
      - 답변글 번호 : 해당 기능제안 글의 id를 가지고있는 답글 데이터의 id (tableData.replyId)_string
      - 작성자 : 답글 작성자의 id (tableData.userId)_string
      - 작성일 : 답글이 생성된 날짜 (tableData.createdAt)_string
    *****************************************************************************************************
    */
export default function ReplyTable(props: ReplyTableProps): JSX.Element {
  const {
    replyData, handleReplyData, handleReplyEditModeOff, selectedSuggestionId,
  } = props;
  const isMdWidth = useMediaQuery('(min-width:1200px)');

  return (
    <MaterialTable
      title="기능 제안 답변"
      columns={[
        {
          title: '기능제안 글번호',
          field: 'suggestionId',
          render: (rowData) => (
            <Typography className="suggestionId">
              { selectedSuggestionId }
            </Typography>
          ),
        },
        {
          title: '답변글 번호',
          field: 'replyId',
          render: (rowData) => {
            const { replyId } = rowData;
            return (
              <Typography className="replyId">
                { replyId }
              </Typography>
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
          title: '작성일',
          field: 'createdAt',
          render: (rowData) => {
            const { createdAt } = rowData;
            return (
              <Typography className="createdAt">{createdAt}</Typography>
            );
          },
        },

      ]}
      data={replyData || []}
      onRowClick={(e, rowData: any) => {
        handleReplyData(rowData);
        handleReplyEditModeOff();
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
