import { useEffect, useState } from 'react';
import { useInView, useReducedMotion } from './useInView';

export function useDemoLoop<T extends Element>(durations: number[], finalIndex: number, maxRuns = 3) {
  const [ref, inView] = useInView<T>({ threshold: 0.4 });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [runs, setRuns] = useState(0);
  const [paused, setPaused] = useState(false);

  const stopped = reduce || paused || runs >= maxRuns;
  const playing = inView && !stopped;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (index === durations.length - 1) {
        setRuns((r) => r + 1);
        setIndex(0);
      } else {
        setIndex(index + 1);
      }
    }, durations[index]);
    return () => clearTimeout(timer);
  }, [playing, index, durations]);

  function toggle() {
    if (stopped) {
      setPaused(false);
      setRuns(0);
      setIndex(0);
    } else {
      setPaused(true);
    }
  }

  return { ref, index: stopped ? finalIndex : index, playing, stopped, toggle, controllable: !reduce };
}
