import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, Clock, MapPin, Map as MapIcon, DollarSign, Upload, X, Route as RouteIcon, Calendar, Tag, ShieldCheck, Search } from 'lucide-react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import { useAttractionStore, type Attraction } from '../store/attractionStore';
import { useRouteStore } from '../store/routeStore';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function AttractionsPage() {
  const { attractions, addAttraction, updateAttraction, deleteAttraction } = useAttractionStore();
  const { routes, fetchRoutes } = useRouteStore();
  const [showForm, setShowForm] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [viewingAttraction, setViewingAttraction] = useState<Attraction | null>(null);
  const [formImage, setFormImage] = useState<string | null>(null);

  // 地图选点相关状态
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearch, setMapSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [tempLat, setTempLat] = useState<number | null>(null);
  const [tempLng, setTempLng] = useState<number | null>(null);


  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // 获取关联线路
  const relatedRoutes = viewingAttraction
    ? routes.filter(route =>
      route.waypoints.some(wp => wp.locationName === viewingAttraction.name)
    )
    : [];

  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除这个景点吗？')) {
      deleteAttraction(id);
    }
  };

  const handleOpenForm = (attraction?: Attraction) => {
    if (attraction) {
      setEditingAttraction(attraction);
      setFormImage(attraction.images[0] || null);
      setTempLat(attraction.lat);
      setTempLng(attraction.lng);
    } else {
      setEditingAttraction(null);
      setFormImage(null);
      setTempLat(null);
      setTempLng(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAttraction(null);
    setFormImage(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      openingHours: formData.get('openingHours') as string,
      ticketPrice: Number(formData.get('ticketPrice')),
      images: formImage ? [formImage] : [],
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t !== ''),
      facilities: (formData.get('facilities') as string).split(',').map(f => f.trim()).filter(f => f !== ''),
      recommendedSeason: (formData.get('recommendedSeason') as string).split(',').map(s => s.trim()).filter(s => s !== ''),
      lat: tempLat || 30.0,
      lng: tempLng || 120.0,
    };

    if (editingAttraction) {
      updateAttraction(editingAttraction.id, data);
    } else {
      addAttraction(data);
    }
    handleCloseForm();
  };

  // 地图点击事件处理
  function MapEvents() {
    useMapEvents({
      click(e) {
        setTempLat(e.latlng.lat);
        setTempLng(e.latlng.lng);
      },
    });
    return null;
  }

  // 位置搜索
  const handleMapSearch = async () => {
    if (!mapSearch.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearch)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setTempLat(lat);
    setTempLng(lng);
    setSearchResults([]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            景点管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            维护旅游景点信息，包括单张封面图、坐标定位与服务设施
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' }
          }}
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenForm()}
        >
          新增景点
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ width: '100%' }}>
        {attractions.map((attraction) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={attraction.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={attraction.images[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'}
                  alt={attraction.name}
                />
                <Box sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: 1
                }}>
                  <Typography variant="caption" fontWeight="bold" color="primary">
                    {attraction.ticketPrice > 0 ? `¥${attraction.ticketPrice}` : '免费'}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Typography variant="h6" fontWeight="bold" noWrap gutterBottom>
                  {attraction.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  mb: 2,
                  height: 40,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4
                }}>
                  {attraction.description}
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={14} className="text-blue-500" />
                    <Typography variant="caption" color="text.secondary" noWrap>{attraction.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={14} className="text-orange-500" />
                    <Typography variant="caption" color="text.secondary">{attraction.openingHours}</Typography>
                  </Box>
                </Stack>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {attraction.tags.slice(0, 3).map(tag => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                  ))}
                </Box>
              </CardContent>
              <Divider sx={{ opacity: 0.6 }} />
              <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
                <Box>
                  <Tooltip title="查看详情">
                    <IconButton size="small" color="primary" onClick={() => setViewingAttraction(attraction)}>
                      <Eye size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="编辑">
                    <IconButton size="small" color="info" onClick={() => handleOpenForm(attraction)}>
                      <Pencil size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Tooltip title="删除">
                  <IconButton size="small" color="error" onClick={() => handleDelete(attraction.id)}>
                    <Trash2 size={18} />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Form Dialog - Optimized Layout */}
      <Dialog
        open={showForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden' }
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              {editingAttraction ? '编辑景点' : '新增旅游景点'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              完善景点的基本信息、图片及地理坐标
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 0 }}>
            <Box sx={{ py: 2 }}>
              <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                {/* Left Side: Images */}
                <Grid size={{ xs: 12, md: 4 }} sx={{ p: 0 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    封面图 <Typography variant="caption" color="text.secondary">(限一张)</Typography>
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '3/4',
                      borderRadius: 3,
                      border: '2px dashed',
                      borderColor: formImage ? 'primary.main' : 'divider',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50'
                      }
                    }}
                    component="label"
                  >
                    {formImage ? (
                      <>
                        <Box
                          component="img"
                          src={formImage}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: 'rgba(0,0,0,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '&:hover': { opacity: 1 }
                        }}>
                          <Typography variant="body2" color="white" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Upload size={16} /> 更换图片
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Stack alignItems="center" spacing={1}>
                        <Box sx={{
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: 'background.paper',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                          <Upload size={32} className="text-gray-400" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">点击或拖拽上传</Typography>
                      </Stack>
                    )}
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </Box>
                </Grid>

                {/* Right Side: Fields */}
                <Grid size={{ xs: 12, md: 8 }} sx={{ p: 0 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>核心信息</Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="name"
                            label="景点名称"
                            required
                            defaultValue={editingAttraction?.name}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="ticketPrice"
                            label="门票价格"
                            type="number"
                            defaultValue={editingAttraction?.ticketPrice}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><DollarSign size={16} /></InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            size="small"
                            name="location"
                            label="具体地址"
                            required
                            defaultValue={editingAttraction?.location}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><MapPin size={16} /></InputAdornment>,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Tooltip title="在地图上选择坐标">
                                    <IconButton onClick={() => setShowMapModal(true)} size="small" color="primary">
                                      <MapIcon size={18} />
                                    </IconButton>
                                  </Tooltip>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="lat"
                            label="经度"
                            type="number"
                            value={tempLat || ''}
                            onChange={(e) => setTempLat(Number(e.target.value))}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="lng"
                            label="纬度"
                            type="number"
                            value={tempLng || ''}
                            onChange={(e) => setTempLng(Number(e.target.value))}
                            required
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>运营配置</Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="openingHours"
                            label="开放时间"
                            placeholder="08:00 - 18:00"
                            defaultValue={editingAttraction?.openingHours}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><Clock size={16} /></InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="recommendedSeason"
                            label="推荐季节"
                            placeholder="春季, 秋季"
                            defaultValue={editingAttraction?.recommendedSeason.join(', ')}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><Calendar size={16} /></InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="tags"
                            label="景点标签"
                            placeholder="标签1, 标签2"
                            defaultValue={editingAttraction?.tags.join(', ')}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><Tag size={16} /></InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            size="small"
                            name="facilities"
                            label="服务设施"
                            placeholder="设施1, 设施2"
                            defaultValue={editingAttraction?.facilities.join(', ')}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><ShieldCheck size={16} /></InputAdornment>,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>景点描述</Typography>
                      <TextField
                        fullWidth
                        name="description"
                        multiline
                        rows={3}
                        required
                        defaultValue={editingAttraction?.description}
                        placeholder="请输入景点的详细背景和特色介绍..."
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <Box sx={{ height: 16 }} />
          <DialogActions sx={{ px: 4, pb: 3, pt: 0, gap: 1 }}>
            <Button
              onClick={handleCloseForm}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3, borderColor: 'divider', color: 'text.primary' }}
            >
              取消编辑
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: 2, px: 5, boxShadow: 0 }}
            >
              确认保存
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Map Modal */}
      <Dialog
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">选取地理坐标</Typography>
          <IconButton onClick={() => setShowMapModal(false)} size="small"><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'background.default' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索地点，例如：黄山、天安门..."
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMapSearch()}
              sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            />
            <Button
              variant="contained"
              sx={{ flexShrink: 0, borderRadius: 1.5 }}
              onClick={handleMapSearch}
              disabled={isSearching}
              startIcon={isSearching ? <CircularProgress size={16} color="inherit" /> : <Search size={18} />}
            >
              搜索
            </Button>
          </Box>

          <Box sx={{ position: 'relative' }}>
            {searchResults.length > 0 && (
              <Paper sx={{
                position: 'absolute',
                top: 0,
                left: 16,
                right: 16,
                zIndex: 1001,
                maxHeight: 250,
                overflow: 'auto',
                boxShadow: 4,
                borderRadius: 2,
                mt: 1
              }}>
                <List dense>
                  {searchResults.map((result, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemButton onClick={() => selectSearchResult(result)}>
                        <ListItemText
                          primary={result.display_name}
                          secondary={`Lat: ${result.lat}, Lng: ${result.lon}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            <Box sx={{ height: 450, width: '100%', zIndex: 1 }}>
              <MapContainer
                center={[tempLat || 30.0, tempLng || 120.0]}
                zoom={tempLat ? 15 : 4}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <MapEvents />
                {tempLat && tempLng && (
                  <Marker position={[tempLat, tempLng]} />
                )}
              </MapContainer>
            </Box>
          </Box>
          <Box sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="primary.main" fontWeight="bold">当前位置</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {tempLat ? `${tempLat.toFixed(6)}, ${tempLng?.toFixed(6)}` : '未在地图上标注'}
                </Typography>
              </Box>
              {tempLat && (
                <Button size="small" color="primary" onClick={() => {
                  setTempLat(null);
                  setTempLng(null);
                }}>重置坐标</Button>
              )}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowMapModal(false)}>取消</Button>
          <Button
            variant="contained"
            onClick={() => setShowMapModal(false)}
            disabled={!tempLat}
            sx={{ px: 4 }}
          >
            确认选点
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog - Consistent with Form */}
      <Dialog open={!!viewingAttraction} onClose={() => setViewingAttraction(null)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        {viewingAttraction && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold">{viewingAttraction.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MapPin size={14} /> {viewingAttraction.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {viewingAttraction.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" variant="filled" color="primary" />
                ))}
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                <Grid size={{ xs: 12, lg: 7 }} sx={{ p: 0 }}>
                  <Box
                    component="img"
                    src={viewingAttraction.images[0]}
                    sx={{ width: '100%', borderRadius: 3, aspectRatio: '16/9', objectFit: 'cover', boxShadow: 2 }}
                  />
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>关联线路</Typography>
                    {relatedRoutes.length === 0 ? (
                      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: 'action.hover' }}>
                        <Typography variant="body2" color="text.secondary">暂无关联线路信息</Typography>
                      </Paper>
                    ) : (
                      <Grid container spacing={2}>
                        {relatedRoutes.map(route => (
                          <Grid size={{ xs: 12, sm: 6 }} key={route.id}>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 2,
                                p: 1.5,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: 'primary.50',
                                  transform: 'scale(1.02)'
                                }
                              }}
                            >
                              <Box
                                component="img"
                                src={route.posterImage}
                                sx={{ width: 80, height: 60, borderRadius: 2, objectFit: 'cover' }}
                              />
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                  {route.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Chip
                                    label={route.difficulty === 'easy' ? '简单' : route.difficulty === 'medium' ? '中等' : '困难'}
                                    size="small"
                                    color={route.difficulty === 'easy' ? 'success' : route.difficulty === 'medium' ? 'warning' : 'error'}
                                    sx={{ height: 18, fontSize: '0.65rem' }}
                                  />
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <RouteIcon size={12} /> {route.waypoints.length} 站
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, lg: 5 }} sx={{ p: 0 }}>
                  <Stack spacing={4}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>景点故事</Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        {viewingAttraction.description}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>详情信息</Typography>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.default' }}>
                        <Grid container spacing={3}>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">开放时间</Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Clock size={14} /> {viewingAttraction.openingHours}
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">门票参考</Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              ¥ {viewingAttraction.ticketPrice}
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">推荐季节</Typography>
                            <Typography variant="body2" fontWeight="medium">{viewingAttraction.recommendedSeason.join(', ')}</Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">地理坐标</Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {viewingAttraction.lat.toFixed(4)}, {viewingAttraction.lng.toFixed(4)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>服务设施</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {viewingAttraction.facilities.map(facility => (
                          <Chip
                            key={facility}
                            label={facility}
                            size="small"
                            variant="outlined"
                            sx={{ bgcolor: 'background.paper' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewingAttraction(null)}>返回列表</Button>
              <Button
                variant="contained"
                sx={{ borderRadius: 2, px: 4 }}
                onClick={() => {
                  const current = viewingAttraction;
                  setViewingAttraction(null);
                  handleOpenForm(current);
                }}
              >
                进入编辑
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}