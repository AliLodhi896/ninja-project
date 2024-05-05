import { useTranslation } from 'react-i18next';

export default function useAdvenceTranslation({ prefix }: { prefix?: string } = {}) {
  const { t: trans, ...others } = useTranslation();

  let methods: any = { t: trans, ...others };

  if (prefix) {
    methods = {
      _t: (...params: any[]) => {
        return trans(prefix + ':' + params[0], ...params.slice(1, params.length));
      },
      ...methods,
    };
  }

  return methods;
}
