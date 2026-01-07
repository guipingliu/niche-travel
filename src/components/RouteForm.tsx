import { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Chip,
  Paper,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import { Plus, Trash2, Map as MapIcon, Search, Upload, X, ArrowUp, ArrowDown, Library } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { chinaRegions, getCitiesByProvince, getDistrictsByCity } from '../data/cityData';
import { useAttractionStore } from '../store/attractionStore';

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

interface RouteFormData {
  name: string;
  posterImages: string[]; // 改为数组
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  hasGuide: boolean;
  guideInfo?: {
    name: string;
    age: number;
    experience: string;
  };
  isPaid: boolean | string;
  price?: number;
  priceIncludes?: string;
  // 活动时间
  activityStartDate?: string;
  activityEndDate?: string;
  // 报名时间
  registrationStartDate?: string;
  registrationEndDate?: string;
  // 城市信息
  province?: string;
  city?: string;
  district?: string;
  // 注意事项
  notices?: string;
  waypoints: Array<{
    description: string;
    images: string[];
    lat?: number;
    lng?: number;
    locationName?: string;
    duration?: string;
    distance?: string;
  }>;
}

interface RouteFormProps {
  route?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

function MapEvents({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function RouteForm({ route, onSave, onCancel }: RouteFormProps) {
  const defaultValues: RouteFormData = route || {
    name: '',
    posterImages: [],
    difficulty: 'easy',
    tags: [],
    hasGuide: true,
    isPaid: false,
    waypoints: [
      { description: '', images: [], locationName: '' },
      { description: '', images: [], locationName: '' }
    ],
  };

  const { register, handleSubmit, control, watch, getValues, setValue, formState: { errors } } = useForm<RouteFormData>({
    defaultValues: {
      ...defaultValues,
      isPaid: String(defaultValues.isPaid)
    },
  });

  const { fields: waypointFields, append: appendWaypoint, remove: removeWaypoint, update: updateWaypoint, move: moveWaypoint } = useFieldArray({
    control,
    name: 'waypoints',
  });

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(defaultValues.tags || []);
  const [posterImages, setPosterImages] = useState<string[]>(defaultValues.posterImages || []);
  const isPaid = watch('isPaid');

  // Map state
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [tempLocation, setTempLocation] = useState<{ lat: number, lng: number, name: string } | null>(null);
  const waypointsEndRef = useRef<HTMLDivElement>(null);
  const isAppendingRef = useRef(false);

  // Attraction Library Modal state
  const { attractions } = useAttractionStore();
  const [showAttractionModal, setShowAttractionModal] = useState(false);
  const [attractionSearch, setAttractionSearch] = useState('');

  // Cancel confirmation dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const onSubmit = (data: RouteFormData) => {
    onSave({
      ...data,
      isPaid: String(data.isPaid) === 'true',
      tags,
      posterImages,
      posterImage: posterImages[0] || '', // 保持向后兼容
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const searchLocation = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSelectLocation = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSelectedCoords([lat, lng]);
    setTempLocation({ lat, lng, name: result.display_name.split(',')[0] });
    setSearchResults([]);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setTempLocation({ lat, lng, name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
    setSelectedCoords([lat, lng]);
  };

  const saveLocationToWaypoint = () => {
    if (currentWaypointIndex !== null && tempLocation) {
      const currentWaypoint = getValues(`waypoints.${currentWaypointIndex}`);
      updateWaypoint(currentWaypointIndex, {
        ...currentWaypoint,
        lat: tempLocation.lat,
        lng: tempLocation.lng,
        locationName: tempLocation.name
      });
      setShowMapModal(false);
      setTempLocation(null);
      setSelectedCoords(null);
      setSearchQuery('');
    }
  };

  const openMapForWaypoint = (index: number) => {
    setCurrentWaypointIndex(index);
    setShowMapModal(true);
    const waypoint = getValues(`waypoints.${index}`);
    if (waypoint.lat && waypoint.lng) {
      setSelectedCoords([waypoint.lat, waypoint.lng]);
      setTempLocation({ lat: waypoint.lat, lng: waypoint.lng, name: waypoint.locationName || '' });
    }
  };

  const handleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileReaders = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const newImages = await Promise.all(fileReaders);
      const currentWaypoint = getValues(`waypoints.${index}`);
      const currentImages = currentWaypoint.images || [];

      updateWaypoint(index, {
        ...currentWaypoint,
        images: [...currentImages, ...newImages]
      });
    }
  };

  const handleRemoveImage = (waypointIndex: number, imageIndex: number) => {
    const currentWaypoint = getValues(`waypoints.${waypointIndex}`);
    const currentImages = currentWaypoint.images || [];
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    updateWaypoint(waypointIndex, { ...currentWaypoint, images: newImages });
  };

  // 海报图片上传处理
  const handlePosterImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileReaders = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const newImages = await Promise.all(fileReaders);
      setPosterImages([...posterImages, ...newImages]);
    }
  };

  const handleRemovePosterImage = (imageIndex: number) => {
    setPosterImages(posterImages.filter((_, i) => i !== imageIndex));
  };

  // Handle cancel with confirmation
  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    onCancel();
  };

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
  };

  const getPointLabel = (index: number) => {
    return `途径点 ${index + 1}`;
  };

  const getPointColor = () => {
    return 'text.primary';
  };

  useEffect(() => {
    if (isAppendingRef.current) {
      waypointsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      isAppendingRef.current = false;
    }
  }, [waypointFields.length]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Form Content */}
      <Box sx={{ pb: 10 }}>
        <Stack spacing={2.5}>
          {/* 基本信息（重新设计） */}
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                基本信息
              </Typography>

              <Grid container spacing={3}>
                {/* 左侧：表单输入 */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2.5}>
                    {/* 线路名称 */}
                    <TextField
                      fullWidth
                      size="small"
                      label="线路名称"
                      {...register('name', { required: '请输入线路名称' })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />

                    {/* 难度和参与方式 */}
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>难度等级</InputLabel>
                          <Controller
                            name="difficulty"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select {...field} label="难度等级">
                                <MenuItem value="easy">🟢 简单</MenuItem>
                                <MenuItem value="medium">🟡 中等</MenuItem>
                                <MenuItem value="hard">🔴 困难</MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel shrink sx={{ bgcolor: 'background.paper', px: 0.5 }}>参与方式</InputLabel>
                          <Box sx={{
                            px: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <Controller
                              name="isPaid"
                              control={control}
                              render={({ field }) => (
                                <RadioGroup row {...field} sx={{ width: '100%', justifyContent: 'space-around' }}>
                                  <FormControlLabel
                                    value="false"
                                    control={<Radio size="small" />}
                                    label={<Typography variant="body2">免费</Typography>}
                                    sx={{ mr: 0 }}
                                  />
                                  <FormControlLabel
                                    value="true"
                                    control={<Radio size="small" />}
                                    label={<Typography variant="body2">付费</Typography>}
                                    sx={{ mr: 0 }}
                                  />
                                </RadioGroup>
                              )}
                            />
                          </Box>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* 城市选择 */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
                        📍 所在城市
                      </Typography>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller
                            name="province"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth size="small">
                                <InputLabel>省份</InputLabel>
                                <Select
                                  {...field}
                                  label="省份"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setValue('city', '');
                                    setValue('district', '');
                                  }}
                                >
                                  {chinaRegions.map((province) => (
                                    <MenuItem key={province.code} value={province.code}>
                                      {province.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth size="small" disabled={!watch('province')}>
                                <InputLabel>市</InputLabel>
                                <Select
                                  {...field}
                                  label="市"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setValue('district', '');
                                  }}
                                >
                                  {getCitiesByProvince(watch('province') || '').map((city) => (
                                    <MenuItem key={city.code} value={city.code}>
                                      {city.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller
                            name="district"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth size="small" disabled={!watch('city')}>
                                <InputLabel>区/县</InputLabel>
                                <Select {...field} label="区/县">
                                  {getDistrictsByCity(watch('province') || '', watch('city') || '').map((district) => (
                                    <MenuItem key={district.code} value={district.code}>
                                      {district.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* 标签 */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
                        🏷️ 标签
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <TextField
                          label="添加标签"
                          size="small"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          sx={{ flex: 1, maxWidth: 250 }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleAddTag}
                          startIcon={<Plus size={16} />}
                        >
                          添加
                        </Button>
                      </Box>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            onDelete={() => handleRemoveTag(tag)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* 注意事项 */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
                        ⚠️ 注意事项
                      </Typography>
                      <Controller
                        name="notices"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={10}
                            size="small"
                            placeholder="请输入参与者需要注意的事项，如安全提示、装备要求、天气提醒等"
                          />
                        )}
                      />
                    </Box>
                  </Stack>
                </Grid>

                {/* 右侧：海报图片 */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{
                    height: '100%',
                    minHeight: 400,
                    border: '2px dashed',
                    borderColor: posterImages.length > 0 ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: posterImages.length > 0 ? 'primary.50' : 'background.default',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        📸 海报图片
                      </Typography>
                      <Button
                        component="label"
                        variant="contained"
                        size="small"
                        startIcon={<Upload size={16} />}
                      >
                        上传
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handlePosterImageUpload}
                        />
                      </Button>
                    </Box>

                    {posterImages.length === 0 ? (
                      <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary'
                      }}>
                        <Upload size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          点击上传按钮添加海报图片
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          支持多张图片上传
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ flex: 1, overflowY: 'auto' }}>
                        <Grid container spacing={1.5}>
                          {posterImages.map((img, imgIndex) => (
                            <Grid size={{ xs: 6 }} key={imgIndex}>
                              <Box
                                sx={{
                                  position: 'relative',
                                  paddingTop: '100%',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  boxShadow: 1
                                }}
                              >
                                <Box
                                  component="img"
                                  src={img}
                                  alt={`Poster ${imgIndex + 1}`}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    '&:hover': {
                                      bgcolor: 'error.main',
                                    },
                                    p: 0.5,
                                    minWidth: 'auto',
                                    width: 28,
                                    height: 28
                                  }}
                                  onClick={() => handleRemovePosterImage(imgIndex)}
                                >
                                  <X size={16} />
                                </IconButton>
                                {imgIndex === 0 && (
                                  <Chip
                                    label="封面"
                                    size="small"
                                    color="primary"
                                    sx={{
                                      position: 'absolute',
                                      bottom: 4,
                                      left: 4,
                                      height: 20,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Paid Route Details */}
              {String(isPaid) === 'true' && (
                <Box sx={{ mt: 3, p: 2.5, bgcolor: 'warning.50', borderRadius: 2, border: '1px solid', borderColor: 'warning.200' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    💰 付费活动详情
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="价格 (元)"
                        {...register('price', { required: String(isPaid) === 'true', min: 0 })}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="费用包含"
                        {...register('priceIncludes', { required: String(isPaid) === 'true' })}
                        error={!!errors.priceIncludes}
                        helperText={errors.priceIncludes?.message}
                        placeholder="例如：交通、住宿、保险"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Controller
                        name="activityStartDate"
                        control={control}
                        rules={{ required: String(isPaid) === 'true' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            type="datetime-local"
                            label="活动开始"
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Controller
                        name="activityEndDate"
                        control={control}
                        rules={{ required: String(isPaid) === 'true' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            type="datetime-local"
                            label="活动结束"
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Controller
                        name="registrationStartDate"
                        control={control}
                        rules={{ required: String(isPaid) === 'true' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            type="datetime-local"
                            label="报名开始"
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Controller
                        name="registrationEndDate"
                        control={control}
                        rules={{ required: String(isPaid) === 'true' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            size="small"
                            type="datetime-local"
                            label="报名结束"
                            slotProps={{
                              inputLabel: { shrink: true }
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Waypoints */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                路线规划
              </Typography>

              <Stack spacing={2}>
                {waypointFields.map((field, index) => (
                  <Paper key={field.id} variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ color: getPointColor() }}>
                        {getPointLabel(index)}
                      </Typography>

                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => index > 0 && moveWaypoint(index, index - 1)}
                          disabled={index === 0}
                        >
                          <ArrowUp size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => index < waypointFields.length - 1 && moveWaypoint(index, index + 1)}
                          disabled={index === waypointFields.length - 1}
                        >
                          <ArrowDown size={16} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => removeWaypoint(index)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Stack>
                    </Box>

                    <Grid container spacing={1.5}>
                      <Grid size={12}>
                        <Controller
                          name={`waypoints.${index}.description` as const}
                          control={control}
                          rules={{ required: '请输入描述' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              multiline
                              minRows={2}
                              maxRows={6}
                              size="small"
                              label="描述"
                              error={!!errors.waypoints?.[index]?.description}
                              helperText={errors.waypoints?.[index]?.description?.message}
                            />
                          )}
                        />
                      </Grid>

                      {/* Duration and Distance - Show for all except Start point (index 0) */}
                      {index !== 0 && (
                        <>
                          <Grid size={{ xs: 6 }}>
                            <Controller
                              name={`waypoints.${index}.distance` as const}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  size="small"
                                  label="距离上一节点 (km)"
                                  placeholder="例如: 5.2"
                                />
                              )}
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Controller
                              name={`waypoints.${index}.duration` as const}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  size="small"
                                  label="预计耗时"
                                  placeholder="例如: 2小时"
                                />
                              )}
                            />
                          </Grid>
                        </>
                      )}

                      <Grid size={12}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MapIcon size={16} />}
                            onClick={() => openMapForWaypoint(index)}
                          >
                            {getValues(`waypoints.${index}.locationName`) ? '修改位置' : '选择位置'}
                          </Button>
                          {getValues(`waypoints.${index}.locationName`) && (
                            <Chip
                              label={getValues(`waypoints.${index}.locationName`)}
                              size="small"
                              variant="outlined"
                            />
                          )}

                          <Button
                            component="label"
                            variant="outlined"
                            size="small"
                            startIcon={<Upload size={16} />}
                          >
                            上传图片
                            <input
                              type="hidden"
                              {...register(`waypoints.${index}.images` as const)}
                            />
                            <input
                              type="file"
                              hidden
                              multiple
                              accept="image/*"
                              onChange={(e) => handleImageUpload(index, e)}
                            />
                          </Button>
                        </Stack>
                      </Grid>

                      {/* Image Previews */}
                      {field.images && field.images.length > 0 && (
                        <Grid size={12}>
                          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                            {field.images.map((img, imgIndex) => (
                              <Box key={imgIndex} sx={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}
                                style={{ marginTop: '6px' }}>
                                <Box
                                  component="img"
                                  src={img}
                                  alt={`Preview ${imgIndex}`}
                                  sx={{ width: '100%', height: '100%', borderRadius: 1, objectFit: 'cover' }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: -6,
                                    right: -6,
                                    bgcolor: 'background.paper',
                                    boxShadow: 2,
                                    '&:hover': { bgcolor: 'error.light', color: 'white' },
                                    p: 0.5,
                                    minWidth: 'auto',
                                    width: 24,
                                    height: 24
                                  }}
                                  onClick={() => handleRemoveImage(index, imgIndex)}
                                >
                                  <X size={14} />
                                </IconButton>
                              </Box>
                            ))}
                          </Stack>
                        </Grid>
                      )}

                      <input type="hidden" {...register(`waypoints.${index}.lat` as const)} />
                      <input type="hidden" {...register(`waypoints.${index}.lng` as const)} />
                      <input type="hidden" {...register(`waypoints.${index}.locationName` as const)} />
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Sticky Footer */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: { xs: 0, sm: 240 },
          right: 0,
          p: 2,
          bgcolor: 'background.paper',
          zIndex: 1000,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<Plus size={18} />}
            onClick={() => {
              isAppendingRef.current = true;
              appendWaypoint({ description: '', images: [], lat: undefined, lng: undefined, locationName: '' });
            }}
          >
            添加途径点
          </Button>
          <Button
            variant="outlined"
            color="info"
            size="medium"
            startIcon={<Library size={18} />}
            onClick={() => setShowAttractionModal(true)}
          >
            从景点库选择
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" size="medium" onClick={handleCancelClick}>取消</Button>
          <Button variant="contained" size="medium" type="submit">保存</Button>
        </Box>
      </Paper>

      {/* Map Modal */}
      <Dialog
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>选择位置</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索地点 (例如: 北京)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            />
            <Button variant="contained" onClick={searchLocation} startIcon={<Search size={16} />} sx={{ flexShrink: 0 }}>
              搜索
            </Button>
          </Box>

          {searchResults.length > 0 && (
            <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              {searchResults.map((result, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton onClick={() => handleSelectLocation(result)}>
                    <ListItemText primary={result.display_name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          <Box sx={{ height: 400, width: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <MapContainer
              center={selectedCoords || [35, 105]}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapEvents onClick={handleMapClick} />
              {tempLocation && (
                <Marker position={[tempLocation.lat, tempLocation.lng]} />
              )}
            </MapContainer>
          </Box>

          {tempLocation && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              已选位置: {tempLocation.name} ({tempLocation.lat.toFixed(4)}, {tempLocation.lng.toFixed(4)})
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMapModal(false)}>取消</Button>
          <Button onClick={saveLocationToWaypoint} variant="contained" disabled={!tempLocation}>
            确认选择
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={showCancelDialog}
        onClose={handleCloseCancelDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>确认退出</DialogTitle>
        <DialogContent>
          <Typography>
            您确定要退出吗？未保存的更改将会丢失。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} variant="outlined">
            继续编辑
          </Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            确认退出
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attraction Library Modal */}
      <Dialog
        open={showAttractionModal}
        onClose={() => setShowAttractionModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          从景点库选择
          <IconButton onClick={() => setShowAttractionModal(false)} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            size="small"
            placeholder="搜索景点名称..."
            sx={{ mb: 2 }}
            value={attractionSearch}
            onChange={(e) => setAttractionSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {attractions
              .filter(a => a.name.toLowerCase().includes(attractionSearch.toLowerCase()))
              .map((attraction) => (
                <ListItem
                  key={attraction.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      isAppendingRef.current = true;
                      appendWaypoint({
                        description: attraction.description,
                        images: attraction.images,
                        locationName: attraction.name,
                        lat: attraction.lat,
                        lng: attraction.lng,
                      });
                      setShowAttractionModal(false);
                    }}
                  >
                    <Box
                      component="img"
                      src={attraction.images[0]}
                      sx={{ width: 60, height: 60, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                    />
                    <ListItemText
                      primary={attraction.name}
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                          {attraction.location}
                        </Typography>
                      }
                    />
                    <Button variant="outlined" size="small">选择</Button>
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}