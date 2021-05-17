import React, { useCallback, useContext, useState } from 'react';
import _get from 'lodash/get';
import _keys from 'lodash/keys'
import { Box, Button, TextInput } from 'grommet';
import Toast from './Toast';
import {
  AccountContext,
  ContractContext,
  transformItemFarmInfoToTableData,
  transformItemSaleInfoToTableData
} from '../utils';
import ItemFetchAndDisplay from './ItemFetchAndDisplay';

const ManageTab = () => {
  const [fetchedItemData, setFetchedItemData] = useState({});
  const [tableInfoData, setTableInfoData] = useState([]);
  const [sellPrice, setSellPrice] = useState('');
  const [searchErrorText, setSearchErrorText] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');
  const { contract, web3, gasPrice, fetchItemSaleInfo, fetchItemFarmInfo } = useContext(ContractContext);
  const { account, accountType } = useContext(AccountContext);
  const fetchItemByUpc = useCallback(async (upc) => {
    if (!upc) {
      setFetchedItemData({});
      setTableInfoData([]);
      return;
    }
    const [farmInfo, saleInfo] = await Promise.all([
      fetchItemFarmInfo(upc), fetchItemSaleInfo(upc)
    ]);
    if (!farmInfo) {
      return setSearchErrorText('Item Not Found');
    }
    setFetchedItemData({
      ...farmInfo,
      ...saleInfo
    })
    setTableInfoData([
      ...transformItemFarmInfoToTableData(farmInfo),
      ...transformItemSaleInfoToTableData(saleInfo),
    ]);
  }, [fetchItemFarmInfo, fetchItemSaleInfo, setSearchErrorText, setTableInfoData, setFetchedItemData]);
  const makeHandleAction = useCallback((method) => async () => {
    const upc = Number(_get(fetchedItemData, 'itemUPC', 0));
    if (!upc) return;
    const args = [upc];
    const txObject = {
      from: account,
      gasPrice,
    };
    try {
      if (method === 'sellItem') {
        const priceInWei = web3.utils.toWei(sellPrice, 'ether');
        args.push(priceInWei);
      } else if (method === 'buyItem') {
        const priceInWei = web3.utils.toWei(sellPrice, 'ether');
        txObject.value = priceInWei;
      }
      await contract.methods[method](...args).send(txObject);
      setSellPrice('');
      fetchItemByUpc(upc);
    } catch (e) {
      console.log('Error', e);
      setActionErrorMsg(e.message);
    }
  }, [account, contract, gasPrice, web3, fetchedItemData, fetchItemByUpc, sellPrice]);

  const getAccountActionButtons = useCallback((disableActions) => {
    switch (accountType) {
      case 'FARMER': 
      const isReadyToSell = Number(_get(fetchedItemData, 'itemState', false)) === 2;
        return (
          <>
          { isReadyToSell ?  
              <Box width="200px">
                <TextInput
                  placeholder="Set Price(ETH)"
                  value={sellPrice}
                  onChange={({ target: { value }}) => setSellPrice(value)}
                />
              </Box>
             : null }
            <Button disabled={disableActions} label="Process" onClick={makeHandleAction('processItem')} gap="small" />
            <Button disabled={disableActions} label="Pack" onClick={makeHandleAction('packItem')} gap="small" />
            <Button disabled={disableActions} label="Put on Sale" onClick={makeHandleAction('sellItem')} gap="small" />
            <Button disabled={disableActions} primary label="Ship" onClick={makeHandleAction('shipItem')} gap="small" /> 
          </>
        );
      case 'DISTRIBUTOR':
        return (
          <>
            <Box width="200px">
              <TextInput
                placeholder="Amount (ETH)"
                value={sellPrice}
                onChange={({ target: { value }}) => setSellPrice(value)}
              />
            </Box>
            <Button disabled={disableActions} primary label="Buy" onClick={makeHandleAction('buyItem')} gap="small" />
          </>
        );
      case 'RETAILER':
        return (
          <>
            <Button disabled={disableActions} primary label="Receive" onClick={makeHandleAction('receiveItem')} gap="small" />
          </>
        );
      case 'CONSUMER':
        return (
          <>
            <Button disabled={disableActions} primary label="Purchase" onClick={makeHandleAction('purchaseItem')} gap="small" />
          </>
        );
      default: 
          return null;
    }
  }, [accountType, makeHandleAction, fetchedItemData, sellPrice]);

  const disableActions = _keys(fetchedItemData).length === 0;
  
  return (
    <Box width="large" background="light-2" round="small" margin="medium" pad="medium">
      <ItemFetchAndDisplay
        fetchItemByUpc={fetchItemByUpc}
        setSearchErrorText={setSearchErrorText}
        searchErrorText={searchErrorText}
        tableInfoData={tableInfoData}
      />
      <Box direction="row" justify="between" align="center" pad={{ vertical: 'medium' }}>
        { getAccountActionButtons(disableActions)}
      </Box>
      { actionErrorMsg ? <Toast msg={actionErrorMsg} onClose={() => setActionErrorMsg('')} /> : null }
    </Box>
  );
};

export default ManageTab;