import { Button, styled } from '@mui/material';


export const StyledButton = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
      backgroundColor: '#ffe099',
      color: '#47331f',
      boxShadow: '0.2px 1px 1px #999999',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      width: '180px',
      margin: '20px',
      '&:hover': {
        backgroundColor: '#ffc94d',
      },
    },
  }));
