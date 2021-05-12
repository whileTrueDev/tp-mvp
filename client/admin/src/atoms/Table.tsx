import React, { forwardRef } from 'react';
import { useTheme } from '@material-ui/core/styles';
import MaterialTable, { Icons } from 'material-table';
import {
  Check, Clear, Delete, FilterList, FirstPage, ViewColumn,
  LastPage, ChevronRight, ChevronLeft, ArrowUpward, Search,
} from '@material-ui/icons';

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
const localization = {
  body: {
    deleteTooltip: '삭제',
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

interface Props extends Record<string, any>{
  title?: string,
  loading?: boolean,
  columns: any[],
  data: any,
}

// UsersTable, UserBroadcastTable 에 공통으로 사용하는 테이블 컴포넌트
const Table = (props: Props): JSX.Element => {
  const theme = useTheme();
  const { loading, options: propOptions } = props;
  const baseOptions = {
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
      textAlign: 'center',
      wordBreak: 'keep-all',
    },
    pageSize: 30,
    pageSizeOptions: [20, 30, 50],
    ...propOptions,
  };
  return (
    <>
      <MaterialTable
        {...props}
        localization={localization}
        icons={tableIcons}
        isLoading={loading}
        options={baseOptions}
      />
    </>
  );
};
export default Table;
