import { isAddress } from '../../utils';
import { Token } from '@bscswap/sdk';

export function filterSnapshots(list: any[], search: string): any[] {
  if (search.length === 0) return list;

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  if (lowerSearchParts.length === 0) {
    return list;
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);

    return lowerSearchParts.every(
      (p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)),
    );
  };

  return list.filter((token) => {
    const { address, block } = token;

    return (
      (address && matchesSearch(address.toString())) || (block && matchesSearch(block.toString()))
    );
  });
}
