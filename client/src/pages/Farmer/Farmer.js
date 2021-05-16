import React, { useState } from 'react';
import { Box, Heading, Main, Tab, Tabs } from 'grommet';
import HarvestTab from './HarvestTab';
import ManageTab from './ManageTab';

const Farmer = () => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  return (
    <Main pad={{ horizontal: 'large', vertical: 'medium'}}>
      <Heading level="2">Hello, Farmer!</Heading>
      <Box align="center">
        <Tabs activeIndex={activeTabIdx} onActive={setActiveTabIdx}>
          <Tab title="Harvest New">
            <HarvestTab />
          </Tab>
          <Tab title="Manage Harvest">
            <ManageTab />
          </Tab>          
        </Tabs>
      </Box>
    </Main>
  )
};

export default Farmer;