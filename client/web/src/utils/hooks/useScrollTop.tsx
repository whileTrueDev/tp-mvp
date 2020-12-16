import { useEffect, useState } from 'react';

export default function useScrollTop(): void {
  const [currentPath, setCurPath] = useState('');
  const [prevPath, setPrevPath] = useState('');
  useEffect(() => {
    setCurPath(window.location.pathname);
    if (currentPath !== prevPath) {
      setTimeout(() => window.scrollTo(0, 0), 10);
      setPrevPath(currentPath);
    }
  });
}
