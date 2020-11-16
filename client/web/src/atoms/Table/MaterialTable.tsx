import React from 'react';
import MuiMaterialTable, { MaterialTableProps, Column } from 'material-table';
import {
  ArrowUpward, Check, Clear,
  ChevronLeft, ChevronRight,
  FilterList, FirstPage, LastPage,
  Delete, Search,
} from '@material-ui/icons';

const tableIcons = {
  Check: React.forwardRef<SVGSVGElement>((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  ResetSearch: React.forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef<SVGSVGElement>((props, ref) => <Delete {...props} ref={ref} />),
  Filter: React.forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef<SVGSVGElement>((props, ref) => <ChevronLeft {...props} ref={ref} />),
  SortArrow: React.forwardRef<SVGSVGElement>((props, ref) => <ArrowUpward {...props} ref={ref} />),
  Search: React.forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
};

const localization = {
  body: {
    emptyDataSourceMessage: '해당하는 데이터가 없습니다.',
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
    nRowsSelected: '{0}개 데이터가 선택되었습니다',
    searchTooltip: '',
    searchPlaceholder: '검색어를 입력하세요',
  },
};

interface CustomMaterialTableProps<T extends Record<string, any>> extends MaterialTableProps<T> {
  cellWidth?: number;
  style?: React.CSSProperties;
}

export default function MaterialTable<RowDataType extends Record<string, any>>(
  props: CustomMaterialTableProps<RowDataType>,
): JSX.Element {
  const { columns, cellWidth, ...rest } = props;

  function styleColumn(_columns: Column<RowDataType>[], minWidth = 100): Column<RowDataType>[] {
    _columns.map((col) => {
      const column = col;
      column.cellStyle = { minWidth, ...column };
      return column;
    });
    return _columns;
  }

  return (
    <MuiMaterialTable
      icons={tableIcons}
      localization={localization}
      columns={styleColumn(columns, cellWidth)}
      {...rest}
    />
  );
}
