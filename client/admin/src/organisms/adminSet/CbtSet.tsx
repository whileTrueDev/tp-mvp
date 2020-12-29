import React from 'react';
import { Grid, Typography } from '@material-ui/core';
// organisms
import CbtTable from './table/CbtTable';
import RegisterDialg from '../cbt/RegisterDialog';

/*
dataprops
**********************************************************************************
<개요>
CbtSet 위한 props입니다.
**********************************************************************************
tabledata (optional) : 공지사항 데이터를 전달받는 속성값입니다.
cbtLoading (optional) : cbt 관리하기에대한 백엔드 요청에대한 loading상태를 관리하는 속성값입니다.
reload : 공지사항 글목록 변경사항을 랜더링하기위한 핸들러함수를 전달받습니다.
**********************************************************************************
 */
interface dataprops {
  tabledata?: any;
  cbtLoading?: any;
  reload: () => void;
}
/*
CbtSet
**********************************************************************************
<개요>
cbt 회원목록을 보여주는 컴포넌트 입니다.
**********************************************************************************
1. CbtSet : Cbt 테이블과 회원가입하기 dialog가 모여있는 부모 컴포넌트입니다.
2. Cbt텝에서는 cbt 회원목록, 회원등록 dialog 컴포넌트가 있습니다.
3. 게재할 목록 Table에대한 data를 이 컴포넌트의 부모 컴포넌트에서 백엔드로부터 get 요청한후 받은 데이터를
  table에 렌더링합니다.
**********************************************************************************
 */
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
