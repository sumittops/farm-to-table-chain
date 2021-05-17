import React, { useContext, useState } from 'react';
import { Box, Heading, Main, Tab, Tabs } from 'grommet';
import HarvestTab from './HarvestTab';
import ManageTab from './ManageTab';
import { AccountContext, toCapitalCase } from '../utils';

const Dashboard = () => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const { accountType } = useContext(AccountContext);
  return (
    <Main pad={{ horizontal: 'large', vertical: 'medium'}}>
      <Heading level="2">Hello, {toCapitalCase(accountType)}!</Heading>
      <Box align="center">
        { accountType === 'FARMER' ? (
          <Tabs activeIndex={activeTabIdx} onActive={setActiveTabIdx}>
            <Tab title="Harvest New">
              <HarvestTab />
            </Tab>
            <Tab title="Manage Harvest">
              <ManageTab />
            </Tab>          
          </Tabs>
        ) : (
          <ManageTab />
        )}
      </Box>
    </Main>
  )
};

export default Dashboard;