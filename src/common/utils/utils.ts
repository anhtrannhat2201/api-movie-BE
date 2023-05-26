import { Request } from 'express';

export const getFileUrl = (req: Request, dir: string, filename: string) => {
  const url =
    req.protocol + '://' + req.get('host') + '/' + dir + '/' + filename;
  return url;
};

type OmitT<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = OmitT<T, K> & Partial<Pick<T, K>>;
