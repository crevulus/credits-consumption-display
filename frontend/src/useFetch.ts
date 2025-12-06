import { useState, useEffect } from "react";

type UseFetchResult<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
};

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setIsError(false);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        console.log("Fetch error:", error);
      }
    }

    fetchData();
  }, [url]);

  return { data, isLoading, isError };
}
