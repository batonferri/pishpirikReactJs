import axios from "axios";
import { useEffect, useState } from "react";

export const useQuery = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();
    (async () => {
      try {
        const res = await axios.get(url, {
          cancelToken: source.token,
        });
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      source.cancel();
    };
  }, [url]);

  return { data, loading, error };
};
