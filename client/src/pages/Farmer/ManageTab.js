import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Box, Button, DataTable, FormField, TextInput, Text } from 'grommet';
import { ContractContext, transformItemFarmInfoToTableData, transformItemSaleInfoToTableData } from '../../utils';

const ManageTab = () => {
  const [upcText, setUpcText] = useState('');
  const [fetchedItemData, setFetchedItemData] = useState([]);
  const { fetchItemFarmInfo, fetchItemSaleInfo } = useContext(ContractContext);
  const handleUpcFieldChange = useCallback((e) => {
    setUpcText(e.target.value);
  }, [setUpcText]);
  const handleUpcFieldBlur = useCallback(async () => {
    const upc = parseInt(upcText);
    if (isNaN(upc)) return;
    const [farmInfo, saleInfo] = await Promise.all([
      fetchItemFarmInfo(upc), fetchItemSaleInfo(upc)
    ]);
    setFetchedItemData([
      ...transformItemFarmInfoToTableData(farmInfo),
      ...transformItemSaleInfoToTableData(saleInfo),
    ]);
  }, [fetchItemFarmInfo, fetchItemSaleInfo, upcText]);
  const handleUpcFieldFocus = useCallback(() => {
    setFetchedItemData([]);
  }, [setFetchedItemData]);
  const tableColumns = useMemo(() => ([{
    property: 'name',
    header: <Text>Property</Text> 
  }, {
    property: 'value',
    header: <Text>Value</Text> 
  }]),[]);
  return (
    <Box width="large" background="light-2" round="small" margin="medium" pad="medium">
      <FormField label="UPC">
        <TextInput
          type="number"
          placeholder="Universal Product Code (UPC)"
          onChange={handleUpcFieldChange}
          onBlur={handleUpcFieldBlur}
          onFocus={handleUpcFieldFocus}
        />
      </FormField>
      <Box pad="small" margin="small">
        { fetchedItemData && fetchedItemData.length ? ( 
          <DataTable columns={tableColumns} data={fetchedItemData} />
        ) : !fetchedItemData ? <Text size="small" color="status-error">Item Not Found</Text> : null}
        </Box>
      <Box direction="row" justify="between" align="center">
        <Button disabled={!(fetchedItemData && fetchedItemData.length)} label="Process" gap="small" />
        <Button disabled={!(fetchedItemData && fetchedItemData.length)} label="Pack" gap="small" />
        <Button disabled={!(fetchedItemData && fetchedItemData.length)} label="Put on Sale" gap="small" />
        <Button disabled={!(fetchedItemData && fetchedItemData.length)} label="Ship" gap="small" /> 
      </Box>
    </Box>
  );
};

export default ManageTab;