import { ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'wouter';
import type { NavItem } from './navItems';

type Props = {
  item: NavItem;
  onNavigate: (item: NavItem) => void;
};

/** A link, a button or a plain label, depending on the item. */
export function NavEntry({ item, onNavigate }: Props) {
  const text = <ListItemText primary={item.name} />;

  if (item.path) {
    return (
      <ListItemButton
        component={Link}
        href={item.path}
        onClick={() => onNavigate(item)}
        sx={{ textAlign: 'center' }}
      >
        {text}
      </ListItemButton>
    );
  }

  if (item.onClick) {
    return (
      <ListItemButton onClick={item.onClick} sx={{ textAlign: 'center' }}>
        {text}
      </ListItemButton>
    );
  }

  return (
    <ListItemText
      primary={item.name}
      sx={{ px: 2, py: 1, textAlign: 'center' }}
    />
  );
}
