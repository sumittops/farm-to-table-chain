import React, { useCallback, useContext, useState } from 'react';
import { Box, Button, Form, FormField, Grid, Heading, TextInput } from 'grommet';
import { AccountContext, ContractContext, validateNotEmpty } from '../../utils';

const HarvestTab = () => {
  const [harvestItemState, setHarvestState] = useState({
    upc: 1,
  });
  const reset = useCallback((upc) => setHarvestState({
    upc,
    originFarmName: '',
    originFarmInformation: '',
    originFarmLatitude: '',
    originFarmLongitude: '',
    productNotes: '',
  }), [setHarvestState]);
  const account = useContext(AccountContext);
  const contract = useContext(ContractContext);
  const handleHarverstSubmit = useCallback(async () => {
    const {
      upc,
      originFarmName, originFarmInformation,
      originFarmLatitude, originFarmLongitude,
      productNotes,
    } = harvestItemState;
    let isValid = validateNotEmpty({ originFarmName, originFarmInformation, productNotes, originFarmLatitude, originFarmLongitude });
    isValid = isValid && !!upc;
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
      reset(upc + 1);
    }
  }, [account, contract, harvestItemState, reset]);

  return (
    <Box background="light-2" round="small" margin="medium" pad="medium">
      <Form
        value={harvestItemState}
        onChange={setHarvestState}
        onSubmit={handleHarverstSubmit}
      >
        <Grid
          columns={['medium', 'medium']}
          gap="medium"
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
        </Grid>
        <Box gap="medium" direction="row" justify="end">
          <Button type="submit" primary label="Harvest!" />
        </Box>
      </Form>
    </Box>
  );
};

export default HarvestTab;