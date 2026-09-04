import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { DrawerAppBar } from '~/components/ui';

export default function Home() {
  return (
    <>
      <DrawerAppBar />

      <Container maxWidth="md">
        <Box sx={{ py: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            About
          </Typography>

          <Typography variant="body1" paragraph>
            This Web interface is part of my bachelor thesis. It allows for
            human in the loop sentence selection to aid AI summaries.
          </Typography>

          <Typography variant="body1" paragraph></Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" component="h2" gutterBottom>
            Links
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link
              href="https://github.com/afriendlyRaptor/hitlais"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>

            <Link
              href="https://prg.inf.unibe.ch/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Project Website
            </Link>

            <Link href="">Contact</Link>
          </Box>
        </Box>
      </Container>
    </>
  );
}
