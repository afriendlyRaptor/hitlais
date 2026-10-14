import { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'wouter';
import { APP_NAME } from '~/config';
import { useUserId } from '~/hooks';
import { logAction } from '~/services';
import type { HistoryEntry } from '~/types';
import { HistoryDrawer, type HistoryPanel } from './HistoryDrawer';
import { NavDrawer } from './NavDrawer';
import { getNavItems, type NavItem } from './navItems';

type Props = {
  /** Adds a button that opens the version history. */
  history?: HistoryPanel;
};

/**
 * https://mui.com/material-ui/react-app-bar/
 */
export function DrawerAppBar({ history }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const navItems = getNavItems(useUserId());

  const handleDrawerToggle = () => {
    logAction('drawer_toggled', { open: !mobileOpen });
    setMobileOpen((previous) => !previous);
  };

  const handleHistoryToggle = () => {
    logAction('history_drawer_toggled', { open: !historyOpen });
    setHistoryOpen((previous) => !previous);
  };

  const handleRestore = (entry: HistoryEntry) => {
    history?.onRestore(entry);
    setHistoryOpen(false);
  };

  // logs nav items identified by path
  const handleNavClick = (item: NavItem) => {
    logAction('nav_click', { path: item.path, label: item.name });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}icon.png`}
              alt={APP_NAME}
              sx={{
                width: 32,
                height: 32,
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ lineHeight: 1, display: 'flex', alignItems: 'center' }}
            >
              {APP_NAME}
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {navItems.map((item) =>
              item.path ? (
                <ListItemButton
                  key={item.name}
                  component={Link}
                  href={item.path}
                  onClick={() => handleNavClick(item)}
                  sx={{ textAlign: 'center' }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ) : (
                <ListItemText key={item.name} primary={item.name} sx={{ px: 2 }} />
              )
            )}
          </Box>

          {history && (
            <IconButton
              color="inherit"
              aria-label="Verlauf"
              onClick={handleHistoryToggle}
              sx={{ ml: 'auto' }}
            >
              <HistoryIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <NavDrawer
        open={mobileOpen}
        items={navItems}
        onToggle={handleDrawerToggle}
        onItemClick={handleNavClick}
      />

      {history && (
        <HistoryDrawer
          open={historyOpen}
          onClose={handleHistoryToggle}
          entries={history.entries}
          activeId={history.activeId}
          onRestore={handleRestore}
        />
      )}

      {/* Spacer so page content starts below the fixed AppBar */}
      <Box sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}
