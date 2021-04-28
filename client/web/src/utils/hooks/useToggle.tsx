import React from 'react';

export default function useToggle(defaultToggle = false): {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggle: () => void;
} {
  const [toggle, setToggle] = React.useState<boolean>(defaultToggle);
  function handleToggle(): void {
    setToggle(!toggle);
  }
  return { toggle, handleToggle, setToggle };
}
