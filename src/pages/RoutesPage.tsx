
import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Map, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import RouteForm from '../components/RouteForm';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

type Difficulty = 'easy' | 'medium' | 'hard';

interface Route {
  id: number;
  name: string;
  posterImage: string;
  difficulty: Difficulty;
  tags: string[];
  hasGuide: boolean;
  guideInfo?: {
    name: string;
    age: number;
    experience: string;
  };
  isPaid: boolean;
  price?: number;
  priceIncludes?: string;
  waypoints: Array<{
    description: string;
    images: string[];
    lat?: number;
    lng?: number;
    locationName?: string;
  }>;
}

const mockRoutes: Route[] = [
  {
    id: 1,
    name: '西藏雪山探险',
    posterImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    difficulty: 'hard',
    tags: ['登山', '探险', '高原'],
    hasGuide: true,
    guideInfo: {
      name: '张伟',
      age: 35,
      experience: '10年登山经验，西藏本地向导',
    },
    isPaid: true,
    price: 12800,
    priceIncludes: '包含全程交通、住宿、向导费、门票及保险',
    waypoints: [
      {
        description: '拉萨布达拉宫，世界文化遗产',
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'],
        lat: 29.65,
        lng: 91.11,
        locationName: '布达拉宫'
      },
      {
        description: '珠穆朗玛峰大本营，海拔5200米',
        images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400'],
        lat: 28.14,
        lng: 86.85,
        locationName: '珠峰大本营'
      },
    ],
  },
  {
    id: 2,
    name: '江南水乡之旅',
    posterImage: 'https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400',
    difficulty: 'easy',
    tags: ['文化', '休闲', '古镇'],
    hasGuide: true,
    guideInfo: {
      name: '李娜',
      age: 28,
      experience: '5年导游经验，历史文化专家',
    },
    isPaid: true,
    price: 3500,
    priceIncludes: '包含酒店住宿、景点门票、早餐',
    waypoints: [
      {
        description: '周庄古镇，中国第一水乡',
        images: ['https://images.unsplash.com/photo-1512529904539-2034f9e1c8b9?w=400'],
        lat: 31.11,
        lng: 120.85,
        locationName: '周庄古镇'
      },
    ],
  },
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [viewingRoute, setViewingRoute] = useState<Route | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这条线路吗？')) {
      setRoutes(routes.filter(route => route.id !== id));
    }
  };

  const handleSave = (routeData: Omit<Route, 'id'>) => {
    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...routeData, id: editingRoute.id } : r));
    } else {
      setRoutes([...routes, { ...routeData, id: routes.length + 1 }]);
    }
    setShowForm(false);
    setEditingRoute(null);
  };

  const difficultyLabels: Record<Difficulty, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

  const difficultyColors: Record<Difficulty, 'success' | 'warning' | 'error'> = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            线路管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            管理旅游线路，包括线路信息、途径点、领队信息等
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setShowForm(true)}
        >
          新增线路
        </Button>
      </Box>

      {/* Form Dialog */}
      <Dialog
        open={showForm || !!editingRoute}
        onClose={() => {
          setShowForm(false);
          setEditingRoute(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRoute ? '编辑线路' : '新增线路'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <RouteForm
              route={editingRoute || undefined}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingRoute(null);
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Stack spacing={3}>
        {routes.map((route) => (
          <Card key={route.id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 200, sm: 'auto' } }}
              image={route.posterImage}
              alt={route.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography component="div" variant="h6" fontWeight="bold">
                        {route.name}
                      </Typography>
                      <Chip
                        label={difficultyLabels[route.difficulty]}
                        color={difficultyColors[route.difficulty]}
                        size="small"
                        variant="outlined"
                      />
                      {route.isPaid && (
                        <Chip
                          label="付费"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {route.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'grey.100' }} />
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={3} color="text.secondary" fontSize="0.875rem">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Map size={16} />
                        {route.waypoints.length} 个途径点
                      </Box>
                      {route.hasGuide && route.guideInfo && (
                        <Box>
                          领队: {route.guideInfo.name} ({route.guideInfo.age}岁)
                        </Box>
                      )}
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => setViewingRoute(route)} color="default">
                      <Eye size={20} />
                    </IconButton>
                    <IconButton onClick={() => setEditingRoute(route)} color="primary">
                      <Pencil size={20} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(route.id)} color="error">
                      <Trash2 size={20} />
                    </IconButton>
                  </Stack>
                </Box>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Stack>

      {routes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Map size={48} color="#9ca3af" style={{ margin: '0 auto' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>暂无线路</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            开始创建第一条旅游线路吧！
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => setShowForm(true)}
            sx={{ mt: 3 }}
          >
            新增线路
          </Button>
        </Box>
      )}

      {/* View Details Dialog */}
      <Dialog
        open={!!viewingRoute}
        onClose={() => setViewingRoute(null)}
        maxWidth="lg"
        fullWidth
      >
        {viewingRoute && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {viewingRoute.name}
              <IconButton onClick={() => setViewingRoute(null)}>
                <Trash2 size={20} style={{ opacity: 0 }} /> {/* Placeholder for alignment if needed, or just use close icon */}
                <Box component="span" sx={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setViewingRoute(null)}>×</Box>
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <CardMedia
                component="img"
                height="300"
                image={viewingRoute.posterImage}
                alt={viewingRoute.name}
                sx={{ borderRadius: 2, mb: 3 }}
              />

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">难度</Typography>
                  <Typography variant="body1">{difficultyLabels[viewingRoute.difficulty]}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">付费类型</Typography>
                  <Typography variant="body1">
                    {viewingRoute.isPaid ? (
                      <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                        付费参与 (¥{viewingRoute.price})
                      </Box>
                    ) : '免费参与'}
                  </Typography>
                  {viewingRoute.isPaid && viewingRoute.priceIncludes && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      包含: {viewingRoute.priceIncludes}
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">领队信息</Typography>
                  {viewingRoute.hasGuide && viewingRoute.guideInfo ? (
                    <Box>
                      <Typography variant="body1">{viewingRoute.guideInfo.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {viewingRoute.guideInfo.age}岁 • {viewingRoute.guideInfo.experience}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1">无领队</Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">标签</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                    {viewingRoute.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                </Grid>
              </Grid>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>路线地图</Typography>
                <Box sx={{ height: 300, width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                  <MapContainer
                    center={[35, 105]}
                    zoom={4}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {viewingRoute.waypoints.map((waypoint, index) => (
                      waypoint.lat && waypoint.lng && (
                        <Marker key={index} position={[waypoint.lat, waypoint.lng]}>
                          <Popup>
                            <strong>{waypoint.locationName || `途径点 ${index + 1} `}</strong>
                            <br />
                            {waypoint.description}
                          </Popup>
                        </Marker>
                      )
                    ))}
                    {viewingRoute.waypoints.some(w => w.lat && w.lng) && (
                      <Polyline
                        positions={viewingRoute.waypoints
                          .filter(w => w.lat && w.lng)
                          .map(w => [w.lat!, w.lng!])}
                        color="blue"
                      />
                    )}
                  </MapContainer>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>途径点详情</Typography>
                <Stack spacing={2}>
                  {viewingRoute.waypoints.map((waypoint, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {waypoint.locationName || `途径点 ${index + 1} `}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {waypoint.description}
                            </Typography>
                            {waypoint.lat && waypoint.lng && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.disabled', fontSize: '0.75rem' }}>
                                <MapPin size={14} style={{ marginRight: 4 }} />
                                {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                              </Box>
                            )}
                          </Box>
                        </Box>
                        {waypoint.images.length > 0 && (
                          <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                            {waypoint.images.map((img, imgIndex) => (
                              <Box
                                key={imgIndex}
                                component="img"
                                src={img}
                                alt={`途径点图片 ${imgIndex + 1} `}
                                sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                              />
                            ))}
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewingRoute(null)}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}