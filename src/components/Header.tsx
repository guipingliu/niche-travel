import { Bell, Search, Menu as MenuIcon } from 'lucide-react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Stack,
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

interface HeaderProps {
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

export function Header({ handleDrawerToggle, drawerWidth }: HeaderProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
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

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: '9999px',
              backgroundColor: alpha(theme.palette.common.black, 0.05),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.08),
              },
              mr: 2,
              ml: 0,
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 0.5
            }}
          >
            <Search size={20} color={theme.palette.text.secondary} />
            <InputBase
              placeholder="搜索..."
              sx={{ ml: 1, flex: 1 }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton color="inherit">
            <Badge variant="dot" color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 1 }}>
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              sx={{ width: 36, height: 36, border: '2px solid white', boxShadow: 1 }}
            />
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle2" lineHeight={1.2}>Admin User</Typography>
              <Typography variant="caption" color="text.secondary">管理员</Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}