import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { getErrorMessage } from '../lib/errors';

interface State<T> {
  data: T | null;
  error: string;
  loading: boolean;
}

export function useApi<T>(path: string) {
  const [state, setState] = useState<State<T>>({ data: null, error: '', loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    api.get<T>(path).then(
      (response) => active && setState({ data: response.data, error: '', loading: false }),
      (err) => active && setState((prev) => ({ data: prev.data, error: getErrorMessage(err), loading: false })),
    );
    return () => {
      active = false;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
