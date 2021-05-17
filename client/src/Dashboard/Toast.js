import { Box, Layer, Text } from 'grommet';
import React, { useEffect } from 'react'

const Toast = ({ duration = 3000, msg = '', onClose, target = null }) => {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, duration);
  }, []);
  return <Layer
    full
    position="bottom"
    plain
    target={target}
  >
    <Box
      height="72px"
      round="medium"
      width="500px" background="status-critical"
      pad={{ vertical: 'medium', horizontal: 'small' }}
      margin={{ vertical: "medium", horizontal: 'auto' }}
    >
      <Text size="13px" color="light-1">
        { msg }
      </Text>
    </Box>
  </Layer>
};

export default Toast;
