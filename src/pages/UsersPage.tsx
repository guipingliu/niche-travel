import { useState } from 'react';
import { Search, MoreHorizontal, User, Trash2, CheckCircle, Ban, Calendar, Clock, DollarSign } from 'lucide-react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  TablePagination,
  Checkbox
} from '@mui/material';

type UserRole = 'admin' | 'user' | 'vip';
type UserStatus = 'active' | 'inactive' | 'banned';

interface AppUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  registrationDate: string;
  lastLogin: string;
  totalSpent: number;
  avatar?: string;
}

const mockUsers: AppUser[] = [
  {
    id: 1,
    name: '张卫平',
    email: 'zhang@example.com',
    phone: '13812345678',
    role: 'admin',
    status: 'active',
    registrationDate: '2023-01-15',
    lastLogin: '2024-01-20 09:30',
    totalSpent: 1280.50,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    id: 2,
    name: '李小龙',
    email: 'li@example.com',
    phone: '13987654321',
    role: 'vip',
    status: 'active',
    registrationDate: '2023-03-22',
    lastLogin: '2024-01-18 14:45',
    totalSpent: 5600.00,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    id: 3,
    name: '王小美',
    email: 'wang@example.com',
    phone: '13700001111',
    role: 'user',
    status: 'inactive',
    registrationDate: '2023-06-10',
    lastLogin: '2023-12-05 11:20',
    totalSpent: 450.00,
  },
  {
    id: 4,
    name: '赵铁柱',
    email: 'zhao@example.com',
    phone: '13655556666',
    role: 'user',
    status: 'banned',
    registrationDate: '2023-02-28',
    lastLogin: '2023-11-15 16:10',
    totalSpent: 0.00,
  },
  {
    id: 5,
    name: '陈静海',
    email: 'chen@example.com',
    phone: '13599998888',
    role: 'vip',
    status: 'active',
    registrationDate: '2023-08-05',
    lastLogin: '2024-01-19 10:15',
    totalSpent: 2300.75,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    id: 6,
    name: '孙悟空',
    email: 'sun@example.com',
    phone: '13344445555',
    role: 'user',
    status: 'active',
    registrationDate: '2023-11-11',
    lastLogin: '2024-01-20 08:00',
    totalSpent: 120.00,
  },
];

const statusColors: Record<UserStatus, 'success' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'warning',
  banned: 'error',
};

const statusLabels: Record<UserStatus, string> = {
  active: '活跃',
  inactive: '未活跃',
  banned: '已封禁',
};

const roleColors: Record<UserRole, 'default' | 'secondary' | 'primary'> = {
  user: 'default',
  vip: 'secondary',
  admin: 'primary',
};

const roleLabels: Record<UserRole, string> = {
  user: '普通用户',
  vip: 'VIP用户',
  admin: '管理员',
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredUsers.map((n) => n.id);
      setSelectedUsers(newSelecteds);
      return;
    }
    setSelectedUsers([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1),
      );
    }
    setSelectedUsers(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateUserStatus = (userId: number, newStatus: UserStatus) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const deleteUser = (userId: number) => {
    if (confirm('确定要删除这个用户吗？此操作不可撤销。')) {
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const bulkUpdateStatus = (newStatus: UserStatus) => {
    if (selectedUsers.length === 0) return;
    if (confirm(`确定要将选中的 ${selectedUsers.length} 个用户状态更新为"${statusLabels[newStatus]}"吗？`)) {
      setUsers(users.map(user =>
        selectedUsers.includes(user.id) ? { ...user, status: newStatus } : user
      ));
      setSelectedUsers([]);
    }
  };

  const bulkDelete = () => {
    if (selectedUsers.length === 0) return;
    if (confirm(`确定要删除选中的 ${selectedUsers.length} 个用户吗？此操作不可撤销。`)) {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
  };

  const isSelected = (id: number) => selectedUsers.indexOf(id) !== -1;

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    vip: users.filter(u => u.role === 'vip').length,
    revenue: users.reduce((sum, user) => sum + user.totalSpent, 0),
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          用户管理
        </Typography>
        <Typography variant="body1" color="text.secondary">
          管理小程序用户，查看用户信息、状态和行为
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'grey.100', color: 'text.secondary' }}>
                <User size={24} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">总用户数</Typography>
                <Typography variant="h6" fontWeight="bold">{stats.total}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.50', color: 'success.main' }}>
                <CheckCircle size={24} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">活跃用户</Typography>
                <Typography variant="h6" fontWeight="bold">{stats.active}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'secondary.50', color: 'secondary.main' }}>
                <User size={24} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">VIP用户</Typography>
                <Typography variant="h6" fontWeight="bold">{stats.vip}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'warning.50', color: 'warning.main' }}>
                <DollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">总消费额</Typography>
                <Typography variant="h6" fontWeight="bold">¥{stats.revenue.toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索用户名称、邮箱或电话"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="状态筛选"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
            >
              <MenuItem value="all">全部状态</MenuItem>
              <MenuItem value="active">活跃</MenuItem>
              <MenuItem value="inactive">未活跃</MenuItem>
              <MenuItem value="banned">已封禁</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="角色筛选"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            >
              <MenuItem value="all">全部角色</MenuItem>
              <MenuItem value="user">普通用户</MenuItem>
              <MenuItem value="vip">VIP用户</MenuItem>
              <MenuItem value="admin">管理员</MenuItem>
            </TextField>
          </Grid>
          {selectedUsers.length > 0 && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button variant="outlined" color="error" size="small" startIcon={<Trash2 size={16} />} onClick={bulkDelete}>
                  批量删除
                </Button>
                <Button variant="outlined" color="warning" size="small" startIcon={<Ban size={16} />} onClick={() => bulkUpdateStatus('banned')}>
                  封禁
                </Button>
                <Button variant="outlined" color="success" size="small" startIcon={<CheckCircle size={16} />} onClick={() => bulkUpdateStatus('active')}>
                  激活
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                  checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>用户信息</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>角色</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>状态</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>注册时间</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>最后登录</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">消费总额</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => {
                const isItemSelected = isSelected(user.id);
                return (
                  <TableRow
                    key={user.id}
                    hover
                    selected={isItemSelected}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={roleLabels[user.role]}
                        size="small"
                        color={roleColors[user.role]}
                        variant={user.role === 'user' ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[user.status]}
                        size="small"
                        color={statusColors[user.status]}
                        icon={user.status === 'active' ? <CheckCircle size={14} /> : user.status === 'banned' ? <Ban size={14} /> : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Calendar size={14} className="text-gray-400" />
                        <Typography variant="body2">{user.registrationDate}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} className="text-gray-400" />
                        <Typography variant="body2">{user.lastLogin}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">¥{user.totalSpent.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton size="small" onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'banned' : 'active')}>
                          {user.status === 'active' ? <Ban size={18} className="text-error-main" /> : <CheckCircle size={18} className="text-success-main" />}
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => deleteUser(user.id)}>
                          <Trash2 size={18} />
                        </IconButton>
                        <IconButton size="small">
                          <MoreHorizontal size={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每页显示:"
        />
      </TableContainer>
    </Box>
  );
}