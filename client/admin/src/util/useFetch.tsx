import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
//host and axios
const axiosInstance = axios.create({
  withCredentials: false,
});


export  function useFetchData(url: string, params: any): any {
  const [param] = useState(params);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000${url}`, { params: param });
      if (res.data) {
        setPayload(res.data);
      } else {
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError(`데이터가 없습니다.${url}`);
    } finally {
      setLoading(false);
    }
  }, [param, url]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  function handlePayload(newData: any) {
    setPayload(newData);
  }

  return {
    payload, loading, error, callUrl, handlePayload,
  };
}

export default function useLateFetch(url: any): any {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // get data function
  const request = useCallback(async (param) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin_notice`, { params: param });
      if (res.data) {
        setPayload(res.data);
      } else {
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError(`데이터가 없습니다./admin_notice`);
    } finally {
      setLoading(false);
    }
  }, [url]);

  function handlePayload(newData: any) {
    setPayload(newData);
  }

  return {
    payload, loading, error, request, handlePayload,
  };
}
