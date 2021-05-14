import _size from 'lodash/size'
import _reduce from 'lodash/reduce'
import { createContext } from 'react'

export const validateNotEmpty = (...values) => {
  return _reduce(values, (agg, current) => (agg && (_size(current) > 0)), true);
}

export const ContractContext = createContext(null);
export const AccountContext = createContext(null);
