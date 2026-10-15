import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { APP_NAME } from '~/config';
import { NavEntry } from './NavEntry';
import type { NavItem } from './navItems';

const DRAWER_WIDTH = 240;

type NavDrawerProps = {
  open: boolean;
  items: NavItem[];
  onToggle: () => void;
  onItemClick: (item: NavItem) => void;
};

/** Slide-in navigation for small screens. */
export function NavDrawer({
  open,
  items,
  onToggle,
  onItemClick,
}: NavDrawerProps) {
  return (
    <nav>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        <Box onClick={onToggle} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            {APP_NAME}
          </Typography>
          <Divider />

          <List>
            {items.map((item) => (
              <ListItem key={item.name} disablePadding>
                <NavEntry item={item} onNavigate={onItemClick} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </nav>
  );
}
