import { useState } from 'react';
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
  CardContent
} from '@mui/material';
import { Plus, Trash2, Map as MapIcon, Search, Upload, X, ArrowUp, ArrowDown } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { chinaRegions, getCitiesByProvince, getDistrictsByCity } from '../data/cityData';

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
  posterImage: string;
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
    posterImage: '',
    difficulty: 'easy',
    tags: [],
    hasGuide: true,
    isPaid: false,
    waypoints: [
      { description: '', images: [], locationName: '' },
      { description: '', images: [], locationName: '' }
    ],
  };

  const { register, handleSubmit, control, watch, getValues, formState: { errors } } = useForm<RouteFormData>({
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
  const isPaid = watch('isPaid');

  // Map state
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [tempLocation, setTempLocation] = useState<{ lat: number, lng: number, name: string } | null>(null);

  const onSubmit = (data: RouteFormData) => {
    onSave({
      ...data,
      isPaid: String(data.isPaid) === 'true',
      tags,
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

  const getPointLabel = (index: number) => {
    return `途径点 ${index + 1}`;
  };

  const getPointColor = () => {
    return 'text.primary';
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Form Content */}
      <Box sx={{ pb: 10 }}>
        <Stack spacing={2.5}>
          {/* 基本信息 */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                基本信息
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="线路名称"
                    {...register('name', { required: '请输入线路名称' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="海报图 URL"
                    {...register('posterImage', { required: '请输入海报图URL' })}
                    error={!!errors.posterImage}
                    helperText={errors.posterImage?.message}
                    placeholder="https://example.com/image.jpg"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>难度</InputLabel>
                    <Controller
                      name="difficulty"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select {...field} label="难度">
                          <MenuItem value="easy">简单</MenuItem>
                          <MenuItem value="medium">中等</MenuItem>
                          <MenuItem value="hard">困难</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 0.5 }}>参与方式</FormLabel>
                    <Controller
                      name="isPaid"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel value="true" control={<Radio size="small" />} label="付费" />
                          <FormControlLabel value="false" control={<Radio size="small" />} label="免费" />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {/* 城市选择 */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>所在城市</Typography>
                <Grid container spacing={2}>
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
                              // 清空市和区
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
                              // 清空区
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

              {/* Paid Route Details */}
              {String(isPaid) === 'true' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
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
                            label="活动开始时间"
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
                            label="活动结束时间"
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
                            label="报名开始时间"
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
                            label="报名结束时间"
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

          {/* Tags */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                标签
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                  label="添加标签"
                  size="small"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{ width: 200 }}
                />
                <Button variant="outlined" size="small" onClick={handleAddTag} startIcon={<Plus size={16} />}>
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
            </CardContent>
          </Card>

          {/* 注意事项 */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                注意事项
              </Typography>
              <Controller
                name="notices"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    label="注意事项"
                    placeholder="请输入参与者需要注意的事项，如安全提示、装备要求、天气提醒等"
                  />
                )}
              />
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
                              rows={2}
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
        <Button
          variant="outlined"
          size="medium"
          startIcon={<Plus size={18} />}
          onClick={() => appendWaypoint({ description: '', images: [], lat: undefined, lng: undefined, locationName: '' })}
        >
          添加途径点
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" size="medium" onClick={onCancel}>取消</Button>
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
            <Button variant="contained" onClick={searchLocation} startIcon={<Search size={16} />}>
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
    </Box>
  );
}