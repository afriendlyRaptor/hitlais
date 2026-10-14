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
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'wouter';
import { APP_NAME } from '~/config';
import { useUserId } from '~/hooks';
import { ROUTES } from '~/routes/paths';
import { logAction } from '~/services';
import { NavDrawer } from './NavDrawer';
import { getNavItems, type NavItem } from './navItems';

/**
 * https://mui.com/material-ui/react-app-bar/
 */
export function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getNavItems(useUserId());

  const handleDrawerToggle = () => {
    logAction('drawer_toggled', { open: !mobileOpen });
    setMobileOpen((previous) => !previous);
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
            component={Link}
            href={ROUTES.root}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
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
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                href={item.path}
                onClick={() => handleNavClick(item)}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <NavDrawer
        open={mobileOpen}
        items={navItems}
        onToggle={handleDrawerToggle}
        onItemClick={handleNavClick}
      />

      {/* Spacer so page content starts below the fixed AppBar */}
      <Box sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}
