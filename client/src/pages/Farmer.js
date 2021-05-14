import React, { useCallback, useContext, useState } from 'react';
import { Box, Button, Form, FormField, Grid, Heading, Main, TextInput } from 'grommet';
import { AccountContext, ContractContext, validateNotEmpty } from '../utils';

const Farmer = () => {
  const [harvestItemState, setHarvestState] = useState({});
  const account = useContext(AccountContext);
  const contract = useContext(ContractContext);
  const handleHarverstSubmit = useCallback(async () => {
    const {
      upc,
      originFarmName, originFarmInformation,
      originFarmLatitude, originFarmLongitude,
      productNotes,
    } = harvestItemState;
    let isValid = validateNotEmpty(originFarmName, originFarmInformation, productNotes);
    isValid = isValid && !upc && !!originFarmLatitude && !!originFarmLongitude;
    if (isValid) {
      await contract.methods.harvestItem(
        upc,
        account,
        originFarmName,
        originFarmInformation,
        originFarmLatitude,
        originFarmLongitude,
        productNotes
      ).call();
    }
  }, [account, contract, harvestItemState]);

  return (
    <Main pad="medium">
      <Heading level="2">Hello, Farmer!</Heading>
      <Grid
        gap="small"
        rows={['large']}
        columns={['medium', 'medium']}
      >
        <Box background="light-3" pad="small">
          <Heading level="3">Harvest Item</Heading>
          <Form
            value={harvestItemState}
            onChange={setHarvestState}
            onSubmit={handleHarverstSubmit}
          >
            <FormField name="upc" label="UPC">
              <TextInput name="upc" type="number" placeholder="Universal Product Code" />
            </FormField>
            <FormField name="originFarmName" label="Farm Name">
              <TextInput name="originFarmName" />
            </FormField>
            <FormField name="originFarmInformation" label="Farm Information">
              <TextInput name="originFarmInformation" />
            </FormField>
            <FormField name="originFarmLatitude" label="Location Latititude">
              <TextInput type="number" name="originFarmLatitude" />
            </FormField>
            <FormField name="originFarmLongitude" label="Location Longitude">
              <TextInput type="number" name="originFarmLongitude" />
            </FormField>
            <FormField name="productNotes" label="About the product">
              <TextInput name="productNotes" />
            </FormField>            
            <Box gap="medium" direction="row" justify="end">
              <Button type="submit" primary label="Harvest!" />
            </Box>
          </Form>
        </Box>
        <Box background="light-3" pad="small">
          <Heading level="4">In Process</Heading>
        </Box>
      </Grid>
    </Main>
  )
};

export default Farmer;