import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer(
  seconds: number | null,
  active: boolean,
  onExpire: () => void
) {
  const [remaining, setRemaining] = useState(seconds ?? 0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(seconds ?? 0);
  }, [seconds]);

  useEffect(() => {
    if (!active || seconds == null || seconds <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, seconds]);

  const reset = useCallback(() => {
    setRemaining(seconds ?? 0);
  }, [seconds]);

  const progress = seconds ? (remaining / seconds) * 100 : 100;

  return { remaining, progress, reset };
}
