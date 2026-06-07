import { useSearchParams } from "react-router-dom";

export function useSearchParamsObj<T extends Record<string, string> = Record<string, string>>(): T {
  const [params] = useSearchParams();
  const out: Record<string, string> = {};
  params.forEach((v, k) => { out[k] = v; });
  return out as T;
}
