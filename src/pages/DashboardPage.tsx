import { Users, Map, Mountain, TrendingUp, MapPin } from 'lucide-react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Button,
  Stack,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const stats = [
  { name: '总用户数', value: '1,234', icon: Users, change: '+12%', changeType: 'positive', color: '#3b82f6' },
  { name: '线路数量', value: '56', icon: Map, change: '+5', changeType: 'positive', color: '#10b981' },
  { name: '景点数量', value: '89', icon: Mountain, change: '+8', changeType: 'positive', color: '#8b5cf6' },
  { name: '本月营收', value: '¥24,580', icon: TrendingUp, change: '+18.2%', changeType: 'positive', color: '#f59e0b' },
];

const recentRoutes = [
  { id: 1, name: '西藏雪山探险', difficulty: '困难', participants: 12, date: '2024-01-15' },
  { id: 2, name: '江南水乡之旅', difficulty: '简单', participants: 24, date: '2024-01-14' },
  { id: 3, name: '丝绸之路文化行', difficulty: '中等', participants: 18, date: '2024-01-13' },
  { id: 4, name: '内蒙古草原骑行', difficulty: '中等', participants: 15, date: '2024-01-12' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
          仪表板
        </Typography>
        <Typography variant="body1" color="text.secondary">
          欢迎回来，这是您的管理后台概览
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.name}>
              <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        {stat.name}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 1 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={24} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: stat.changeType === 'positive' ? 'success.main' : 'error.main',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      较上月
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={4} sx={{ width: '100%' }}>
        {/* Recent Routes */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">
                最近线路
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最近创建的旅游线路
              </Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              <List sx={{ py: 0 }}>
                {recentRoutes.map((route, index) => (
                  <Box key={route.id}>
                    <ListItem sx={{ py: 2.5, px: 3 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.soft', color: 'primary.main' }}>
                          <Map size={20} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {route.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            难度: {route.difficulty}
                          </Typography>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {route.participants} 人参与
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {route.date}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < recentRoutes.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">
                快速操作
              </Typography>
              <Typography variant="body2" color="text.secondary">
                常用管理功能
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/routes')}
                    sx={{
                      height: 120,
                      flexDirection: 'column',
                      gap: 1.5,
                      borderRadius: 2,
                      borderColor: 'primary.200',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <Map size={32} />
                    <Typography variant="subtitle2" fontWeight="bold">新增线路</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/attractions')}
                    sx={{
                      height: 120,
                      flexDirection: 'column',
                      gap: 1.5,
                      borderRadius: 2,
                      borderColor: 'success.200',
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      color: 'success.main',
                      '&:hover': {
                        borderColor: 'success.main',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                      }
                    }}
                  >
                    <Mountain size={32} />
                    <Typography variant="subtitle2" fontWeight="bold">新增景点</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/users')}
                    sx={{
                      height: 120,
                      flexDirection: 'column',
                      gap: 1.5,
                      borderRadius: 2,
                      borderColor: 'secondary.200',
                      bgcolor: alpha(theme.palette.secondary.main, 0.05),
                      color: 'secondary.main',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      }
                    }}
                  >
                    <Users size={32} />
                    <Typography variant="subtitle2" fontWeight="bold">用户管理</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/routes')} // Or statistics page if exists
                    sx={{
                      height: 120,
                      flexDirection: 'column',
                      gap: 1.5,
                      borderRadius: 2,
                      borderColor: 'warning.200',
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      color: 'warning.main',
                      '&:hover': {
                        borderColor: 'warning.main',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                      }
                    }}
                  >
                    <TrendingUp size={32} />
                    <Typography variant="subtitle2" fontWeight="bold">数据统计</Typography>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}