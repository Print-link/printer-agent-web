import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { apiService } from '../../../../services/api';
import type { ServiceTemplate, CreateServiceTemplateData, UpdateServiceTemplateData } from '../../../../types';

interface ServiceTemplateFormProps {
  isOpen: boolean;
  branchId: string;
  subCategoryId: string;
  editingTemplate?: ServiceTemplate | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ServiceTemplateForm({
  isOpen,
  branchId,
  subCategoryId,
  editingTemplate,
  onClose,
  onSuccess,
}: ServiceTemplateFormProps) {
  const { theme } = useTheme();
  const [pricingFormulas, setPricingFormulas] = useState<any[]>([]);
  const [isLoadingFormulas, setIsLoadingFormulas] = useState(false);
  
  const [formData, setFormData] = useState<CreateServiceTemplateData>({
    subCategoryId,
    branchId,
    name: '',
    measurementUnit: 'FEET',
    allowsCustomSize: false,
    supportsFrontBack: false,
    supportsColor: false,
    supportsPrintCut: false,
    pricingFormulaId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormulas = async () => {
      setIsLoadingFormulas(true);
      try {
        const formulas = await apiService.getPricingFormulas();
        setPricingFormulas(formulas);
        if (formulas.length > 0 && !formData.pricingFormulaId) {
          setFormData(prev => ({ ...prev, pricingFormulaId: formulas[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch pricing formulas:', err);
      } finally {
        setIsLoadingFormulas(false);
      }
    };

    if (isOpen) {
      fetchFormulas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        subCategoryId: editingTemplate.subCategoryId,
        branchId: editingTemplate.branchId || branchId,
        name: editingTemplate.name,
        measurementUnit: editingTemplate.measurementUnit,
        allowsCustomSize: editingTemplate.allowsCustomSize,
        supportsFrontBack: editingTemplate.supportsFrontBack,
        supportsColor: editingTemplate.supportsColor,
        supportsPrintCut: editingTemplate.supportsPrintCut,
        pricingFormulaId: editingTemplate.pricingFormulaId || '',
      });
    } else {
      setFormData({
        subCategoryId,
        branchId,
        name: '',
        measurementUnit: 'FEET',
        allowsCustomSize: false,
        supportsFrontBack: false,
        supportsColor: false,
        supportsPrintCut: false,
        pricingFormulaId: pricingFormulas.length > 0 ? pricingFormulas[0].id : '',
      });
    }
    setError(null);
  }, [editingTemplate, isOpen, subCategoryId, branchId, pricingFormulas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingTemplate) {
        await apiService.updateServiceTemplate(editingTemplate.id, formData as UpdateServiceTemplateData);
      } else {
        await apiService.createServiceTemplate(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save template');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold m-0">
            {editingTemplate ? 'Edit Custom Template' : 'Create Custom Template'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Template Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g. Special A4 Glossy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Measurement Unit</label>
              <select
                value={formData.measurementUnit}
                onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value as any })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="FEET">Square Feet</option>
                <option value="INCH">Square Inch</option>
                <option value="UNIT">Per Unit / Page</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Pricing Formula</label>
              <select
                value={formData.pricingFormulaId}
                onChange={(e) => setFormData({ ...formData, pricingFormulaId: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                disabled={isLoadingFormulas}
              >
                {pricingFormulas.map(formula => (
                  <option key={formula.id} value={formula.id}>
                    {formula.code} - {formula.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.allowsCustomSize}
                  onChange={(e) => setFormData({ ...formData, allowsCustomSize: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm font-medium">Custom Size</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.supportsFrontBack}
                  onChange={(e) => setFormData({ ...formData, supportsFrontBack: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm font-medium">Front & Back</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.supportsColor}
                  onChange={(e) => setFormData({ ...formData, supportsColor: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm font-medium">Supports Color</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.supportsPrintCut}
                  onChange={(e) => setFormData({ ...formData, supportsPrintCut: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm font-medium">Print & Cut</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-700 bg-transparent hover:bg-gray-800 text-gray-300'
                  : 'border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
