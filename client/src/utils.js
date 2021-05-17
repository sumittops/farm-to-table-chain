import _size from 'lodash/size'
import _reduce from 'lodash/reduce'
import _values from 'lodash/values';
import _toLower from 'lodash/toLower'
import _upperFirst from 'lodash/upperFirst'
import { createContext } from 'react'

export const validateNotEmpty = (data) => {
  return _reduce(_values(data), (agg, current) => (agg && (_size(current) > 0)), true);
}

const itemStateMap = {
  '0': 'Harvested',
  '1': 'Processed',
  '2': 'Packed',
  '3': 'For Sale',
  '4': 'Sold',
  '5': 'Shipped',
  '6': 'Received',
  '7': 'Purchased'
}

export const transformItemFarmInfoToTableData = data => data ? ([
  { name: 'UPC', value: data.itemUPC },
  { name: 'SKU', value: data.itemSKU },
  { name: 'Current Owner', value: data.ownerID },
  { name: 'Farm ID', value: data.originFarmerID },
  { name: 'Farm Name', value: data.originFarmName },
  { name: 'Latitude', value: data.originFarmLatitude },
  { name: 'Longitude', value: data.originFarmLongitude },
]) : []
export const transformItemSaleInfoToTableData = data => data ? ([
  { name: 'Product ID', value: data.productID },
  { name: 'Product Notes', value: data.productNotes },
  { name: 'Price', value: data.productPrice },
  { name: 'Current State', value: itemStateMap[data.itemState] },
  { name: 'Distributor', value: data.distributorID },
  { name: 'Retailer', value: data.retailerID },
  { name: 'Consumer', value: data.consumerID },
]) : []

export const ContractContext = createContext(null)
export const AccountContext = createContext(null)

export const toCapitalCase = (str) => {
  if (typeof str !== 'string') return str;
  return _upperFirst(_toLower(str));
}
