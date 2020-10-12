import React from 'react';
import axios from './axios';



export default function useFetchData(url: String, params: any) {
  const [param] = React.useState(params);
  const [payload, setPayload] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // get data function
  const callUrl = React.useCallback(async () => {
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

  React.useEffect(() => {
    callUrl();
  }, [callUrl]);

  function handlePayload(newData: any) {
    setPayload(newData);
  }

  return {
    payload, loading, error, callUrl, handlePayload,
  };
}

export function useLateFetch(url: any) {
  const [payload, setPayload] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // get data function
  const request = React.useCallback(async (param) => {
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
  }, [url]);

  function handlePayload(newData: any) {
    setPayload(newData);
  }

  return {
    payload, loading, error, request, handlePayload,
  };
}