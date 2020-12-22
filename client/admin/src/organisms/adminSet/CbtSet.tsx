import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import CbtTable from './table/CbtTable';
import RegisterDialg from '../cbt/RegisterDialog';

/*
  CbtSet : Cbt 테이블과 회원가입하기 dialog가 모여있는 부모 컴포넌트입니다.
  Cbt텝에서는 cbt 회원목록, 회원등록 dialog 컴포넌트가 있습니다.
  게재할 목록 Table에대한 data를 GET하는 요청을 이 컴포넌트가 위치할 페이지에서 하여서, table데이터를 전달하면 됩니다.
 */

interface dataprops {
  tabledata?: any;
  cbtLoading?: any;
  reload: () => void;
}

export default function CbtSet(data: dataprops): JSX.Element {
  // 공지사항 선택을 위한 State
  // useState<NoticeData> 제네릭타입 //
  const {
    tabledata, cbtLoading,
    reload,
  } = data;
  const [selectedData, setSelectedData] = React.useState<any>({
    id: -1,
    privacyAgreement: false,
    content: '',
    name: '',
    idForTest: '',
    creatorName: '',
    email: '',
    platform: '',
    phoneNum: '',
    isComplete: false,
  });

  // dialog hook
  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  React.useEffect(() => {
    if (reload) {
      reload();
    }
  }, [reload]);
  function handleSelectedData(d: any) {
    const user = {
      ...selectedData,
      name: d.name,
      idForTest: d.idForTest,
      creatorName: d.creatorName,
      email: d.email,
      phoneNum: d.phoneNum,
      platform: d.platform,
      privacyAgreement: d.privacyAgreement,
      isComplete: d.isComplete,
      id: d.id,
    };
    setSelectedData(user);
  }

  return (
    <div>
      {cbtLoading && (
        <div style={{ padding: 28 }}>
          <h3>Loading...</h3>
        </div>
      )}
      {!cbtLoading && (
        <div>
          <div style={{ padding: 28 }}>
            <Typography variant="h5">
              Cbt 관리
            </Typography>
          </div>

          <Grid container xs={12}>
            <Grid item xs={12} lg={6}>
              <CbtTable
                tableData={tabledata}
                handleOpen={handleOpen}
                handleData={handleSelectedData}
              />
            </Grid>
            {/* <Grid item xs={12} lg={6}>
              {selectedData && (
              <DataPreView
                handleReload={handleReload}
                selectedData={selectedData}
                handleEditModeOn={handleEditModeOn}
              />
              )}
            </Grid> */}
          </Grid>
        </div>
      )}
      {open && (
      <RegisterDialg
        open={open}
        handleClose={handleClose}
        selectedData={selectedData}
        reload={reload}
      />
      )}
    </div>

  );
}
