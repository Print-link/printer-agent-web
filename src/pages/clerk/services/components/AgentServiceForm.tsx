import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { apiService } from '../../../../services/api';
import type {
  AgentService,
  ServiceTemplate,
  CreateAgentServiceData,
  UpdateAgentServiceData,
} from '../../../../types';

interface AgentServiceFormProps {
  isOpen: boolean;
  branchId: string;
  template?: ServiceTemplate;
  editingService?: AgentService | null;
  subCategory?: { name: string; pricingType?: string };
  onClose: () => void;
  onSuccess: () => void;
}

export function AgentServiceForm({
  isOpen,
  branchId,
  template,
  editingService,
  subCategory,
  onClose,
  onSuccess,
}: AgentServiceFormProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<CreateAgentServiceData>({
    branchId,
    serviceTemplateId: template?.id || editingService?.serviceTemplateId || '',
    pricePerUnit: editingService?.pricePerUnit || 0,
    constant: null,
    colorPriceModifier: editingService?.colorPriceModifier ?? null,
    isActive: true,
    supportsPrintCut: template?.supportsPrintCut || false,
    supportsColor: template?.supportsColor || false,
    supportsFrontBack: template?.supportsFrontBack || false,
    supportsFrontOnly: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBondPaper = useMemo(() => {
    return (
      subCategory?.name?.toLowerCase().includes('bond paper') ||
      template?.pricingFormulaId?.toLowerCase().includes('page_based') ||
      editingService?.subCategory?.name?.toLowerCase().includes('bond paper') ||
      false
    );
  }, [subCategory?.name, template?.pricingFormulaId, editingService?.subCategory?.name]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        branchId: branchId,
        serviceTemplateId: '',
        pricePerUnit: 0,
        constant: null,
        colorPriceModifier: null,
        isActive: true,
        supportsPrintCut: false,
        supportsColor: false,
        supportsFrontBack: false,
        supportsFrontOnly: false,
      });
      setError(null);
      return;
    }

    if (editingService) {
      setFormData({
        branchId: editingService.branchId,
        serviceTemplateId: editingService.serviceTemplateId,
        pricePerUnit: editingService.pricePerUnit,
        constant: editingService.constant ?? null,
        colorPriceModifier: editingService.colorPriceModifier ?? null,
        isActive: editingService.isActive,
        supportsPrintCut: editingService.supportsPrintCut,
        supportsColor: editingService.supportsColor,
        supportsFrontBack: editingService.supportsFrontBack,
        supportsFrontOnly: editingService.supportsFrontOnly ?? false,
      });
    } else if (template) {
      setFormData({
        branchId: branchId,
        serviceTemplateId: template.id,
        pricePerUnit: 0,
        constant: null,
        colorPriceModifier: null,
        isActive: true,
        supportsPrintCut: template.supportsPrintCut || false,
        supportsColor: template.supportsColor || false,
        supportsFrontBack: template.supportsFrontBack || false,
        supportsFrontOnly: false,
      });
    }
  }, [isOpen, editingService, template, branchId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const templateId =
      formData.serviceTemplateId || template?.id || editingService?.serviceTemplateId;
    if (!templateId || templateId.trim() === '') {
      setError('Service template is required. Please select a template first.');
      return;
    }

    const branchIdToUse = formData.branchId || branchId;
    if (!branchIdToUse || branchIdToUse.trim() === '') {
      setError('Branch ID is required');
      return;
    }

    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) {
      setError('Price per unit is required and must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingService) {
        const updateData: UpdateAgentServiceData = {
          pricePerUnit: formData.pricePerUnit,
          constant: formData.constant ?? null,
          colorPriceModifier: formData.colorPriceModifier ?? null,
          isActive: formData.isActive,
          supportsPrintCut: formData.supportsPrintCut,
          supportsColor: formData.supportsColor,
          supportsFrontBack: formData.supportsFrontBack,
          supportsFrontOnly: formData.supportsFrontOnly,
        };
        await apiService.updateAgentService(editingService.id, updateData);
      } else {
        const createData: CreateAgentServiceData = {
          branchId: branchIdToUse,
          serviceTemplateId: templateId,
          pricePerUnit: formData.pricePerUnit,
          constant: formData.constant ?? null,
          colorPriceModifier: formData.colorPriceModifier ?? null,
          isActive: formData.isActive !== undefined ? formData.isActive : true,
          supportsPrintCut: formData.supportsPrintCut,
          supportsColor: formData.supportsColor,
          supportsFrontBack: formData.supportsFrontBack,
          supportsFrontOnly: formData.supportsFrontOnly ?? false,
        };
        await apiService.createAgentService(createData);
      }
      onSuccess();
      setFormData({
        branchId: branchId,
        serviceTemplateId: '',
        pricePerUnit: 0,
        constant: null,
        colorPriceModifier: null,
        isActive: true,
        supportsPrintCut: false,
        supportsColor: false,
        supportsFrontBack: false,
        supportsFrontOnly: false,
      });
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save service';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
      onClick={onClose}
    >
      <div
        className={`rounded-xl p-6 max-w-[450px] w-full max-h-[90vh] overflow-auto shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-xl font-semibold m-0 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {editingService ? 'Edit Service' : 'Create Service'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-md border-none bg-transparent cursor-pointer flex items-center justify-center ${
              theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-500 text-sm mb-5">
            {error}
          </div>
        )}

        {!editingService && template && (
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500 text-blue-500 text-sm mb-5">
            <strong>Configure Branch Pricing:</strong> Set pricing and options for{' '}
            <strong>{template.name}</strong> at your branch. The service template is platform-owned
            and cannot be modified.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {template && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Service Template{' '}
                <span className={`text-xs font-normal ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  (Platform-owned, read-only)
                </span>
              </label>
              <div className={`p-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}>
                <div className="font-semibold mb-1">{template.name}</div>
                {template.description && (
                  <div className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {template.description}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`text-[11px] ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Unit: {template.measurementUnit}
                  </span>
                  {template.allowsCustomSize && (
                    <span className={`text-[11px] ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      • Custom Size
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {isBondPaper ? 'Price per Page *' : 'Price per Unit *'}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricePerUnit || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerUnit: parseFloat(e.target.value) || 0,
                })
              }
              className={`w-full p-3 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              placeholder="0.00"
              required
            />
            {isBondPaper && (
              <div className={`mt-1.5 text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Base price per page (black & white)
              </div>
            )}
          </div>

          {!isBondPaper && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Constant (for inch to sqft conversion)
                <span className={`text-xs font-normal ml-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Optional - defaults to null
                </span>
              </label>
              <input
                type="number"
                value={formData.constant ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    constant: value === '' ? null : parseFloat(value) || null,
                  });
                }}
                className={`w-full p-3 rounded-lg border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                placeholder="Leave empty for null (default)"
              />
            </div>
          )}

          {isBondPaper && template?.supportsColor && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Color Price Modifier (per page)
                <span className={`text-xs font-normal ml-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Optional - fixed amount added per page when color is selected
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.colorPriceModifier ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    colorPriceModifier: value === '' ? null : parseFloat(value) || null,
                  });
                }}
                className={`w-full p-3 rounded-lg border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                placeholder="e.g., 0.25 (additional amount per page for color)"
              />
              <div className={`mt-1.5 p-2 rounded-md text-xs ${
                theme === 'dark'
                  ? 'bg-blue-500/10 text-gray-400'
                  : 'bg-blue-50 text-gray-600'
              }`}>
                <strong>Bond Paper Pricing:</strong> This is a fixed amount added to the unit price per page when color printing is selected. Example: If unit price is 0.50 and modifier is 0.25, color printing costs 0.75 per page.
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="cursor-pointer w-[18px] h-[18px]"
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Active
              </span>
            </label>
            {template?.supportsColor && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.supportsColor}
                  onChange={(e) => setFormData({ ...formData, supportsColor: e.target.checked })}
                  className="cursor-pointer w-[18px] h-[18px]"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Supports Color
                </span>
              </label>
            )}
            {template?.supportsFrontBack && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.supportsFrontBack}
                  onChange={(e) =>
                    setFormData({ ...formData, supportsFrontBack: e.target.checked })
                  }
                  className="cursor-pointer w-[18px] h-[18px]"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Supports Front/Back
                </span>
              </label>
            )}
            {template?.supportsPrintCut && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.supportsPrintCut}
                  onChange={(e) => setFormData({ ...formData, supportsPrintCut: e.target.checked })}
                  className="cursor-pointer w-[18px] h-[18px]"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Supports Print & Cut
                </span>
              </label>
            )}
            {template?.supportsFrontBack && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.supportsFrontOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, supportsFrontOnly: e.target.checked })
                  }
                  className="cursor-pointer w-[18px] h-[18px]"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Supports Front Only
                </span>
              </label>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
              } text-sm font-medium`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-lg border-none text-sm font-semibold ${
                isSubmitting
                  ? 'bg-amber-300 cursor-not-allowed opacity-60'
                  : 'bg-amber-400 hover:bg-amber-500 cursor-pointer'
              } text-gray-900`}
            >
              {isSubmitting ? 'Saving...' : editingService ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

