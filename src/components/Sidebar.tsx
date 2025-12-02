import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LayoutDashboard,
  Map as MapIcon,
  Mountain,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

export function Sidebar({ mobileOpen, handleDrawerToggle, drawerWidth }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear auth tokens here
    // localStorage.removeItem('token');
    navigate('/login');
  };

  const navigation = [
    { name: '仪表盘', href: '/', icon: LayoutDashboard },
    { name: '线路管理', href: '/routes', icon: MapIcon },
    { name: '景点管理', href: '/attractions', icon: Mountain },
    { name: '用户管理', href: '/users', icon: Users },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'grey.900', color: 'white' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            background: 'linear-gradient(to bottom right, #6366f1, #9333ea)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MapIcon size={20} color="white" />
        </Box>
        <Typography variant="h6" fontWeight="bold">
          Niche Travel
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 2 }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.href}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.active': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'grey.400' }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 2, color: 'grey.400', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'grey.400' }}>
                <Settings size={20} />
              </ListItemIcon>
              <ListItemText primary="设置" />
            </ListItemButton>
          </ListItem>
        </List>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2, p: 1 }}>
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Admin"
            sx={{ width: 32, height: 32 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>Admin User</Typography>
            <Typography variant="caption" color="grey.500" noWrap display="block">admin@example.com</Typography>
          </Box>
          <Tooltip title="退出登录">
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{
                color: 'grey.400',
                '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <LogOut size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}