import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, Map, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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
import { useRouteStore } from '../store/routeStore';
import type { Route, Difficulty } from '../store/routeStore';

export default function RoutesPage() {
  const navigate = useNavigate();
  const { routes, deleteRoute, fetchRoutes } = useRouteStore();
  const [viewingRoute, setViewingRoute] = useState<Route | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这条线路吗？')) {
      deleteRoute(id);
    }
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
          onClick={() => navigate('/routes/new')}
        >
          新增线路
        </Button>
      </Box>

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
                    <IconButton onClick={() => navigate(`/routes/${route.id}/edit`)} color="primary">
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
            onClick={() => navigate('/routes/new')}
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
                <Trash2 size={20} style={{ opacity: 0 }} />
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

              <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
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