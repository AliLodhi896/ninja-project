import { isArray } from 'lodash';

export const groupBy = (key: string | number) => (array: any[]) =>
  array.reduce((objectsByKeyValue: { [x: string]: any }, obj: { [x: string]: any }) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const findBy = (key: string | number) => (array: any[]) => (value: any) => {
  if (array !== undefined && isArray(array)) {
    const filtered = array.filter((el) => el[key] === value);
    return filtered.length === 0 ? undefined : filtered[0];
  }
};
