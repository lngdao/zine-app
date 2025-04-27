/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTTPError } from 'ky';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type FetcherFunction<P = any, R = any> = (payload: P) => Promise<R>;

export type CallAPIParamList<T extends FetcherFunction<any, any>> = {
  API: T;
  payload?: Parameters<T>[0];
  beforeSend?: () => void;
  onSuccess?: (res: UnwrapPromise<ReturnType<T>>) => void;
  onError?: (error: HTTPError) => void;
  onFinally?: () => void;
};

export async function callAPIHelper<T extends FetcherFunction<any, any>>({
  API,
  payload,
  beforeSend,
  onSuccess,
  onError,
  onFinally,
}: CallAPIParamList<T>) {
  try {
    beforeSend && beforeSend();
    const res = await API(payload as Parameters<T>[0]);
    onSuccess && onSuccess(res);
  } catch (e) {
    const error = e as HTTPError;
    onError && onError(error);
  } finally {
    onFinally && onFinally();
  }
}
