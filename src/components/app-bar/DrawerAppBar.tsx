import { useState } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { AdminDialog, useAdmin } from '~/components/admin';
import { APP_NAME } from '~/config';
import { useUserId } from '~/hooks';
import { logAction } from '~/services';
import type { HistoryEntry } from '~/types';
import { HistoryDrawer, type HistoryPanel } from './HistoryDrawer';
import { NavDrawer } from './NavDrawer';
import { NavEntry } from './NavEntry';
import { getNavItems, type NavItem } from './navItems';
import { TaskInfoDialog, type TaskInfo } from './TaskInfoDialog';

type Props = {
  /** Adds a button that opens the version history. */
  history?: HistoryPanel;
  /** Adds an info icon (top left) that shows the current task. */
  taskInfo?: TaskInfo;
};

/**
 * https://mui.com/material-ui/react-app-bar/
 */
export function DrawerAppBar({ history, taskInfo }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const admin = useAdmin();
  const navItems = getNavItems(useUserId(), {
    isAdmin: admin?.isAdmin ?? false,
    onIdClick: admin ? () => setAdminOpen(true) : undefined,
  });

  const handleDrawerToggle = () => {
    logAction('drawer_toggled', { open: !mobileOpen });
    setMobileOpen((previous) => !previous);
  };

  const handleHistoryToggle = () => {
    logAction('history_drawer_toggled', { open: !historyOpen });
    setHistoryOpen((previous) => !previous);
  };

  const handleInfoToggle = () => {
    logAction('task_info_toggled', { open: !infoOpen });
    setInfoOpen((previous) => !previous);
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
              src="/icon.png"
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

          {taskInfo && (
            <IconButton
              color="inherit"
              aria-label="Aufgabe anzeigen"
              onClick={handleInfoToggle}
              sx={{ mr: 1, ml: { xs: 0, sm: -1.5 } }}
            >
              <InfoOutlinedIcon />
            </IconButton>
          )}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {navItems.map((item) => (
              <NavEntry
                key={item.name}
                item={item}
                onNavigate={handleNavClick}
              />
            ))}
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

      {taskInfo && (
        <TaskInfoDialog
          open={infoOpen}
          onClose={handleInfoToggle}
          {...taskInfo}
        />
      )}

      <AdminDialog open={adminOpen} onClose={() => setAdminOpen(false)} />

      {/* Spacer so page content starts below the fixed AppBar */}
      <Box sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}
