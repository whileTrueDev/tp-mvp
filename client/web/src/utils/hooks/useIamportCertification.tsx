import React from 'react';

export interface IamportCertificate {
  startCert: () => void;
  impUid?: string;
  error?: string;
}

/**
 * @description Iamport 본인인증을 위한 훅.
 * @param {function} callback 성공시 실행할 콜백함수, iamportUid를 첫번째 인자하는 함수입니다.
 * @return {function}cert(): Iamport 본인 인증 실행 함수  
 * @return {string}impUid: 본인인증 성공 시, 해당 본인인증에 대한 고유 Id로, 
 *   iamport api에 이 Id를 기준으로 정보를 요청하면 본인인증 정보를 알 수 있다.  
 * @return {string}error: 본인인증 실패 시, 실패 정보  
 * 
 */
export default function useIamportCertification(
  callback?: (impUid?: string) => void,
): IamportCertificate {
  const [impUid, setImpUid] = React.useState<string>();
  const [error, setError] = React.useState<string>();

  const startCert = React.useCallback(() => {
    const globalParams: any = window;
    const { IMP } = globalParams;
    IMP.init('imp00026649');

    IMP.certification({ // param
      merchant_uid: 'ORD20180131-0000011',
      min_age: '19',
    }, (res: any) => { // callback
      if (res.success) {
        // 본인인증 성공
        setImpUid(res.imp_uid);
        if (callback) callback(res.imp_uid);
      } else {
        // 본인인증 취소 or 실패
        setError(res.error_msg);
      }
    });
  }, [callback]);

  return { startCert, impUid, error };
}
