import { type FormEvent } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Redirect, useLocation } from 'wouter';
import { ALLOW_MANUAL_USER_ID } from '~/config';
import { useUserId } from '~/hooks';
import { ROUTES } from '~/routes/paths';
import { logAction, setUserId } from '~/services';

export default function Login() {
  const [, navigate] = useLocation();
  const userId = useUserId();

  if (userId) {
    return <Redirect to={ROUTES.study} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = formData.get('userId')?.toString().trim();

    if (!id) return;

    setUserId(id);

    logAction('userId_set', { userID: id });
    navigate(ROUTES.study, { replace: true });
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
            {ALLOW_MANUAL_USER_ID
              ? 'Please enter your user ID to continue.'
              : 'Sie sind nicht angemeldet.'}
          </Typography>
        </Box>

        {ALLOW_MANUAL_USER_ID && (
          <>
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
          </>
        )}
      </Box>
    </Box>
  );
}
