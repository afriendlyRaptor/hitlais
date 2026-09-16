import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { DrawerAppBar } from '~/components/ui';
import { setUserId } from '~/services/logger';
import { useLocation } from 'wouter';
import { logAction } from '~/services';


export default function Login() {
  const [, navigate] = useLocation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = formData.get('userId')?.toString().trim();

    if (!id) return;

    setUserId(id);


    logAction('userId_set', { userID: id });
    navigate('/home');



  };


return (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
    }}
  >
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Please enter your user ID to continue.
        </Typography>
      </Box>

      <TextField
        label="User ID"
        variant="outlined"
        fullWidth
        required
        autoFocus
        name="userId"
        placeholder="Enter your ID"
      />

      <Button type="submit" variant="contained" size="large" fullWidth>
        Continue
      </Button>
    </Box>
  </Box>
);
}
