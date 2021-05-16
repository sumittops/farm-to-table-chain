import React, { useCallback, useContext, useState } from 'react';
import _get from 'lodash/get';
import _keys from 'lodash/keys'
import { Box, Button, TextInput } from 'grommet';

import ItemFetchAndDisplay from '../../components/ItemFetchAndDisplay';
import { AccountContext, ContractContext } from '../../utils';


const ManageTab = () => {
  const [fetchedItemData, setFetchedItemData] = useState({});
  const [sellPrice, setSellPrice] = useState('');
  const { contract, web3, gasPrice } = useContext(ContractContext);
  const { account } = useContext(AccountContext);
  const makeHandleAction = useCallback((method) => async () => {
    const upc = Number(_get(fetchedItemData, 'itemUPC', 0));
    if (!upc) return;
    const args = [upc];
    try {
      if (method === 'sellItem') {
        // const price = Math.abs(Number(sellPrice));
        const priceInWei = web3.utils.toWei(sellPrice, 'ether');
        args.push(priceInWei);
        console.log(args);
      }
      const txObject = {
        from: account,
        gasPrice,
      };
      await contract.methods[method](...args).send(txObject);
      setSellPrice('');
    } catch (e) {
      console.log('Error', e);
    }
  }, [account, contract, gasPrice, web3, fetchedItemData, sellPrice]);
  const disableActions = _keys(fetchedItemData).length === 0;
  const isReadyToSell = _get(fetchedItemData, 'itemState', false) == '2';
  return (
    <Box width="large" background="light-2" round="small" margin="medium" pad="medium">
      <ItemFetchAndDisplay onFetched={setFetchedItemData} />
      { isReadyToSell ? <Box
          width="medium"
          align="center"
          pad="medium"
        >
          <TextInput
            placeholder="Set Price for sale in ETH"
            value={sellPrice}
            onChange={({ target: { value }}) => setSellPrice(value)}
          />
        </Box>: null }
      <Box direction="row" justify="between" align="center">
        <Button disabled={disableActions} label="Process" onClick={makeHandleAction('processItem')} gap="small" />
        <Button disabled={disableActions} label="Pack" onClick={makeHandleAction('packItem')} gap="small" />
        <Button disabled={disableActions} label="Put on Sale" onClick={makeHandleAction('sellItem')} gap="small" />
        <Button disabled={disableActions} label="Ship" onClick={makeHandleAction('shipItem')} gap="small" /> 
      </Box>
    </Box>
  );
};

export default ManageTab;