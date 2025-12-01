import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus, Upload } from 'lucide-react';

interface Waypoint {
  description: string;
  images: string[];
}

interface GuideInfo {
  name: string;
  age: number;
  experience: string;
}

interface RouteFormData {
  name: string;
  posterImage: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  hasGuide: boolean;
  guideInfo?: GuideInfo;
  isPaid: boolean;
  waypoints: Waypoint[];
}

interface RouteFormProps {
  route?: {
    id: number;
    name: string;
    posterImage: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    hasGuide: boolean;
    guideInfo?: GuideInfo;
    isPaid: boolean;
    waypoints: Waypoint[];
  };
  onSave: (data: Omit<RouteFormData, 'id'>) => void;
  onCancel: () => void;
}

export default function RouteForm({ route, onSave, onCancel }: RouteFormProps) {
  const defaultValues: RouteFormData = route || {
    name: '',
    posterImage: '',
    difficulty: 'medium',
    tags: [],
    hasGuide: false,
    isPaid: true,
    waypoints: [],
  };

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<RouteFormData>({
    defaultValues,
  });

  const { fields: waypointFields, append: appendWaypoint, remove: removeWaypoint } = useFieldArray({
    control,
    name: 'waypoints',
  });

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(defaultValues.tags || []);
  const hasGuide = watch('hasGuide');

  const onSubmit = (data: RouteFormData) => {
    onSave({
      ...data,
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

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {route ? '编辑线路' : '新增线路'}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                线路名称 *
              </label>
              <input
                type="text"
                {...register('name', { required: '请输入线路名称' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                海报图 URL *
              </label>
              <input
                type="url"
                {...register('posterImage', { required: '请输入海报图URL' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
              {errors.posterImage && (
                <p className="mt-1 text-sm text-red-600">{errors.posterImage.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                难度 *
              </label>
              <select
                {...register('difficulty', { required: true })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                参与方式
              </label>
              <div className="mt-2 space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('isPaid')}
                    value="true"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">付费参与</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    {...register('isPaid')}
                    value="false"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">免费参与</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="输入标签后按回车"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                {...register('hasGuide')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                是否有领队
              </label>
            </div>

            {hasGuide && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    领队姓名 *
                  </label>
                  <input
                    type="text"
                    {...register('guideInfo.name', { required: hasGuide })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    年龄 *
                  </label>
                  <input
                    type="number"
                    {...register('guideInfo.age', { required: hasGuide, valueAsNumber: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    经验描述 *
                  </label>
                  <input
                    type="text"
                    {...register('guideInfo.experience', { required: hasGuide })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="例如：5年登山经验"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">途径点</h4>
              <button
                type="button"
                onClick={() => appendWaypoint({ description: '', images: [] })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                添加途径点
              </button>
            </div>

            <div className="space-y-6">
              {waypointFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-gray-900">途径点 {index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeWaypoint(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        描述 *
                      </label>
                      <textarea
                        {...register(`waypoints.${index}.description` as const, { required: true })}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="描述这个途径点的特色和体验"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        图片 URLs (每行一个)
                      </label>
                      <textarea
                        {...register(`waypoints.${index}.images` as const)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        每行输入一个图片URL，留空则无图片
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {waypointFields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">暂无途径点</p>
                <p className="text-sm text-gray-500">点击上方按钮添加途径点</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              保存线路
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}