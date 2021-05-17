import React, { useState, useCallback, useMemo } from 'react'
import { Box, DataTable, FormField, Text, TextInput } from 'grommet'


const ItemFetchAndDisplay = ({ tableInfoData, fetchItemByUpc, searchErrorText, setSearchErrorText }) => {
  const [upcText, setUpcText] = useState('');
  const handleUpcFieldChange = useCallback((e) => {
    setUpcText(e.target.value);
  }, [setUpcText]);
  const handleUpcFieldBlur = useCallback(async () => {
    const upc = parseInt(upcText);
    if (isNaN(upc)) return;
    await fetchItemByUpc(upc);
  }, [fetchItemByUpc, upcText]);

  const handleUpcFieldFocus = useCallback(() => {
    fetchItemByUpc(null);
    setSearchErrorText('');
  }, [fetchItemByUpc, setSearchErrorText]);

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
        { tableInfoData && tableInfoData.length ? <DataTable columns={tableColumns} data={tableInfoData} /> : null }
        <Text size="medium" color="status-error">{searchErrorText}</Text> 
      </Box>
    </>
  )
}

export default ItemFetchAndDisplay;