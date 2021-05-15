import React, { useCallback, useContext, useState } from 'react';
import { Box, Button, Form, FormField, Grid, Heading, Main, Tab, Tabs, TextInput } from 'grommet';
import HarvestTab from './HarvestTab';

const Farmer = () => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  return (
    <Main pad="medium">
      <Heading level="2">Hello, Farmer!</Heading>
      <Box align="center">
        <Tabs activeIndex={activeTabIdx} onActive={setActiveTabIdx}>
          <Tab title="Harvest New">
            <HarvestTab />
          </Tab>
          <Tab title="Ready to Pack">
            <Button label="Pack" />
          </Tab>
          <Tab title="Ready to Sale">
            <Button label="Put on Sale" />
          </Tab>
          <Tab title="Ready to Ship">
            <Button label="Ship" /> 
          </Tab>
        </Tabs>
      </Box>
    </Main>
  )
};

export default Farmer;