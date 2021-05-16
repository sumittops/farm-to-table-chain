import React, { useState, useCallback, useMemo, useContext } from 'react'
import { Box, DataTable, FormField, Text, TextInput } from 'grommet'
import { ContractContext, transformItemFarmInfoToTableData, transformItemSaleInfoToTableData } from '../utils';

const ItemFetchAndDisplay = ({ onFetched }) => {
  const [upcText, setUpcText] = useState('');
  const [searchErrorText, setSearchErrorText] = useState('');
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
    if (!farmInfo) {
      return setSearchErrorText('Item Not Found');
    }
    setFetchedItemData([
      ...transformItemFarmInfoToTableData(farmInfo),
      ...transformItemSaleInfoToTableData(saleInfo),
    ]);
    onFetched({ ...farmInfo, ...saleInfo });
  }, [fetchItemFarmInfo, fetchItemSaleInfo, upcText, onFetched]);

  const handleUpcFieldFocus = useCallback(() => {
    setFetchedItemData([]);
    setSearchErrorText('');
    onFetched({});
  }, [setFetchedItemData, setSearchErrorText, onFetched]);

  const tableColumns = useMemo(() => ([{
    property: 'name',
    header: <Text size="small">Property</Text>,
    render: ({ name }) => <Text weight="bold" size="small">{name}</Text>
  }, {
    property: 'value',
    header: <Text size="small">Value</Text>,
    render: ({ value }) => <Text size="small">{value}</Text>
  }]),[]);

  return (
    <>
      <FormField label="UPC">
        <TextInput
          type="number"
          placeholder="Lookup items using Universal Product Code (UPC)"
          onChange={handleUpcFieldChange}
          onBlur={handleUpcFieldBlur}
          onFocus={handleUpcFieldFocus}
        />
      </FormField>
      <Box pad="small" margin="small">
        { fetchedItemData && fetchedItemData.length ? <DataTable columns={tableColumns} data={fetchedItemData} /> : null }
        <Text size="medium" color="status-error">{searchErrorText}</Text> 
      </Box>
    </>
  )
}

export default ItemFetchAndDisplay;