import ky from 'ky';
import { API_URL, TIME_OUT } from '@/config';

const prefixUrl = `${API_URL ? API_URL : ''}/`;

let instance = ky.create({
  prefixUrl,
  timeout: TIME_OUT,
  headers: {
    Accept: 'application/json',
  },
});

const updateInstance = (newPrefixUrl: string) => {
  instance = ky.create({
    prefixUrl: newPrefixUrl,
    timeout: TIME_OUT,
    headers: {
      Accept: 'application/json',
    },
  });
};

export { instance, updateInstance };
