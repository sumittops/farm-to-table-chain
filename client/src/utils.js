import _size from 'lodash/size'
import _reduce from 'lodash/reduce'
import _values from 'lodash/values';
import { createContext } from 'react'

export const validateNotEmpty = (data) => {
  return _reduce(_values(data), (agg, current) => (agg && (_size(current) > 0)), true);
}

export const ContractContext = createContext(null);
export const AccountContext = createContext(null);
