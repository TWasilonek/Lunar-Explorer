import { usePathname, useSearchParams } from "next/navigation";

export const useQueryParams = () => {
  const pathname = usePathname();
  const queryParams = useSearchParams();

  const addQueryParam = (queryParam: string, value: string) => {
    const updatedQueryParams = new URLSearchParams(queryParams);
    updatedQueryParams.set(queryParam, value);
    return updatedQueryParams;
  };

  const removeQueryParam = (queryParam: string) => {
    const updatedQueryParams = new URLSearchParams(queryParams);
    updatedQueryParams.delete(queryParam);
    return updatedQueryParams;
  };

  const addAqueryParamToUrl = (queryParam: string, value: string) => {
    const updatedQueryParams = addQueryParam(queryParam, value);
    return `${pathname}?${updatedQueryParams.toString()}`;
  };

  const removeQueryParamFromUrl = (queryParam: string) => {
    const updatedQueryParams = removeQueryParam(queryParam);
    return `${pathname}?${updatedQueryParams.toString()}`;
  };

  return {
    queryParams,
    pathname,
    addQueryParam,
    removeQueryParam,
    addAqueryParamToUrl,
    removeQueryParamFromUrl,
  };
};
