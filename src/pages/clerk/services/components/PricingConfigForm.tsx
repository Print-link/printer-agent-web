import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit, Check, Eye } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useToast } from '../../../../contexts/ToastContext';
import { apiService } from '../../../../services/api';
import type {
  AgentService,
  PricingConfig,
  BaseConfiguration,
  PricingOption,
  CustomSpecification,
} from '../../../../types';

interface PricingConfigFormProps {
  isOpen: boolean;
  agentService: AgentService;
  onClose: () => void;
  onSuccess: () => void;
}

// Dialog Components
interface AddBaseConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (config: BaseConfiguration) => void;
  theme: 'dark' | 'light';
}

function AddBaseConfigDialog({ isOpen, onClose, onAdd, theme }: AddBaseConfigDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'PRESET' | 'CUSTOM'>('PRESET');
  const [unitPrice, setUnitPrice] = useState(0);
  const [customValue, setCustomValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || unitPrice < 0) return;

    onAdd({
      id: `config_${Date.now()}`,
      name: name.trim(),
      type,
      unitPrice,
      customValue: type === 'CUSTOM' ? customValue.trim() || null : null,
    });

    // Reset form
    setName('');
    setType('PRESET');
    setUnitPrice(0);
    setCustomValue('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`rounded-lg p-6 max-w-md w-full mx-4 shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Add Base Configuration
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              placeholder="e.g., A4"
              required
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'PRESET' | 'CUSTOM')}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            >
              <option value="PRESET">Preset</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Unit Price
            </label>
            <input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              required
            />
          </div>
          {type === 'CUSTOM' && (
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Custom Value (Optional)
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className={`w-full p-2 rounded-md border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                placeholder="e.g., 8.5x11"
              />
            </div>
          )}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddOptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (option: PricingOption) => void;
  theme: 'dark' | 'light';
}

function AddOptionDialog({ isOpen, onClose, onAdd, theme }: AddOptionDialogProps) {
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [priceModifier, setPriceModifier] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: `option_${Date.now()}`,
      name: name.trim(),
      enabled,
      default: isDefault,
      priceModifier,
    });

    // Reset form
    setName('');
    setEnabled(true);
    setIsDefault(false);
    setPriceModifier(0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`rounded-lg p-6 max-w-md w-full mx-4 shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Add Option
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              placeholder="e.g., Color"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="cursor-pointer"
            />
            <label
              htmlFor="enabled"
              className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Enabled
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="default"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="cursor-pointer"
            />
            <label
              htmlFor="default"
              className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Default (pre-selected for customers)
            </label>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Price Modifier
            </label>
            <input
              type="number"
              step="0.01"
              value={priceModifier}
              onChange={(e) => setPriceModifier(parseFloat(e.target.value) || 0)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              required
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddCustomSpecDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (spec: CustomSpecification) => void;
  theme: 'dark' | 'light';
}

function AddCustomSpecDialog({ isOpen, onClose, onAdd, theme }: AddCustomSpecDialogProps) {
  const [name, setName] = useState('');
  const [priceModifier, setPriceModifier] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: `spec_${Date.now()}`,
      name: name.trim(),
      priceModifier,
    });

    // Reset form
    setName('');
    setPriceModifier(0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`rounded-lg p-6 max-w-md w-full mx-4 shadow-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Add Custom Specification
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              placeholder="e.g., Lamination"
              required
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Price Modifier
            </label>
            <input
              type="number"
              step="0.01"
              value={priceModifier}
              onChange={(e) => setPriceModifier(parseFloat(e.target.value) || 0)}
              className={`w-full p-2 rounded-md border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              required
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PricingConfigForm({
  isOpen,
  agentService,
  onClose,
  onSuccess,
}: PricingConfigFormProps) {
  const { theme } = useTheme();
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Dialog states
  const [showAddBaseConfig, setShowAddBaseConfig] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [showAddCustomSpec, setShowAddCustomSpec] = useState(false);
  const [editingBaseConfig, setEditingBaseConfig] = useState<number | null>(null);
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [editingCustomSpec, setEditingCustomSpec] = useState<number | null>(null);

  const [pricingConfig, setPricingConfig] = useState<PricingConfig>({
    baseConfigurations: [],
    options: [],
    customSpecifications: [],
  });

  useEffect(() => {
    if (isOpen && agentService) {
      if (agentService.pricingConfig && 
          agentService.pricingConfig.baseConfigurations && 
          agentService.pricingConfig.options) {
        // Ensure all arrays exist
        setPricingConfig({
          baseConfigurations: agentService.pricingConfig.baseConfigurations || [],
          options: agentService.pricingConfig.options || [],
          customSpecifications: agentService.pricingConfig.customSpecifications || [],
        });
      } else {
        const isBondPaper =
          agentService.subCategory?.name?.toLowerCase().includes('bond paper') || false;

        setPricingConfig({
          baseConfigurations: isBondPaper
            ? [
                { id: 'a6', name: 'A6', type: 'PRESET' as const, unitPrice: 0.4 },
                { id: 'a5', name: 'A5', type: 'PRESET' as const, unitPrice: 0.5 },
                { id: 'a4', name: 'A4', type: 'PRESET' as const, unitPrice: 0.6 },
                { id: 'a3', name: 'A3', type: 'PRESET' as const, unitPrice: 0.8 },
                { id: 'custom', name: 'Custom Size', type: 'CUSTOM' as const, unitPrice: 1.0 },
              ]
            : [
                { id: 'standard', name: 'Standard Size', type: 'PRESET' as const, unitPrice: 0 },
                { id: 'custom', name: 'Custom Size', type: 'CUSTOM' as const, unitPrice: 0 },
              ],
          options: [
            {
              id: 'black_white',
              name: 'Black & White',
              enabled: true,
              default: true,
              priceModifier: 0,
            },
            {
              id: 'front_only',
              name: 'Front Only',
              enabled: true,
              default: true,
              priceModifier: 0,
            },
            ...(agentService.supportsColor
              ? [
                  {
                    id: 'color',
                    name: 'Color',
                    enabled: true,
                    default: false,
                    priceModifier: 0.25,
                  },
                ]
              : []),
            ...(agentService.supportsFrontBack
              ? [
                  {
                    id: 'front_back',
                    name: 'Front & Back',
                    enabled: true,
                    default: false,
                    priceModifier: 0.1,
                  },
                ]
              : []),
            ...(agentService.supportsPrintCut
              ? [
                  {
                    id: 'print_cut',
                    name: 'Print & Cut',
                    enabled: true,
                    default: false,
                    priceModifier: 0.15,
                  },
                ]
              : []),
          ],
          customSpecifications: [],
        });
      }
    }
  }, [isOpen, agentService]);

  if (!isOpen) return null;

  const handleSave = async (activate: boolean = false) => {
    setError(null);

    if (!pricingConfig.baseConfigurations || pricingConfig.baseConfigurations.length === 0) {
      setError('At least one base configuration is required');
      return;
    }

    if (!pricingConfig.options || pricingConfig.options.length === 0) {
      setError('At least one option is required');
      return;
    }

    const hasDefaultOption = (pricingConfig.options || []).some((opt) => opt.default && opt.enabled);
    if (!hasDefaultOption) {
      setError('At least one option must be set as default');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.updateAgentServicePricingConfig(agentService.id, pricingConfig);
      if (activate) {
        await apiService.updateAgentService(agentService.id, { isActive: true });
      }
      success(
        `Pricing configuration ${activate ? 'saved and activated' : 'saved as draft'}`,
        'Success',
        3000
      );
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update pricing configuration';
      setError(errorMessage);
      showError(errorMessage, 'Update Failed', 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBaseConfiguration = (config: BaseConfiguration) => {
    setPricingConfig({
      ...pricingConfig,
      baseConfigurations: [...(pricingConfig.baseConfigurations || []), config],
    });
  };

  const updateBaseConfiguration = (index: number, updates: Partial<BaseConfiguration>) => {
    const updated = [...(pricingConfig.baseConfigurations || [])];
    updated[index] = { ...updated[index], ...updates };
    setPricingConfig({ ...pricingConfig, baseConfigurations: updated });
    setEditingBaseConfig(null);
  };

  const removeBaseConfiguration = (index: number) => {
    if (window.confirm('Are you sure you want to remove this base configuration?')) {
      setPricingConfig({
        ...pricingConfig,
        baseConfigurations: (pricingConfig.baseConfigurations || []).filter((_, i) => i !== index),
      });
    }
  };

  const addOption = (option: PricingOption) => {
    const updated = [...(pricingConfig.options || []), option];
    // If this is set as default, unset other defaults
    if (option.default) {
      updated.forEach((opt, i) => {
        if (i !== updated.length - 1) opt.default = false;
      });
    }
    setPricingConfig({ ...pricingConfig, options: updated });
  };

  const updateOption = (index: number, updates: Partial<PricingOption>) => {
    const updated = [...(pricingConfig.options || [])];
    updated[index] = { ...updated[index], ...updates };
    // If setting as default, unset other defaults
    if (updates.default === true) {
      updated.forEach((opt, i) => {
        if (i !== index) opt.default = false;
      });
    }
    setPricingConfig({ ...pricingConfig, options: updated });
    setEditingOption(null);
  };

  const removeOption = (index: number) => {
    if (window.confirm('Are you sure you want to remove this option?')) {
      setPricingConfig({
        ...pricingConfig,
        options: (pricingConfig.options || []).filter((_, i) => i !== index),
      });
    }
  };

  const addCustomSpecification = (spec: CustomSpecification) => {
    setPricingConfig({
      ...pricingConfig,
      customSpecifications: [...(pricingConfig.customSpecifications || []), spec],
    });
  };

  const updateCustomSpecification = (index: number, updates: Partial<CustomSpecification>) => {
    const updated = [...(pricingConfig.customSpecifications || [])];
    updated[index] = { ...updated[index], ...updates };
    setPricingConfig({ ...pricingConfig, customSpecifications: updated });
    setEditingCustomSpec(null);
  };

  const removeCustomSpecification = (index: number) => {
    if (window.confirm('Are you sure you want to remove this custom specification?')) {
      setPricingConfig({
        ...pricingConfig,
        customSpecifications: (pricingConfig.customSpecifications || []).filter((_, i) => i !== index),
      });
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
        onClick={onClose}
      >
        <div
          className={`rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-auto shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Configure Flexible Pricing
              </h2>
              <div
                className={`text-sm space-y-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <p>
                  <strong>Service:</strong> {agentService.serviceTemplate?.name || 'Unknown'}
                </p>
                {agentService.category && (
                  <p>
                    <strong>Category:</strong> {agentService.category.name} →{' '}
                    {agentService.subCategory?.name}
                  </p>
                )}
                {!agentService.pricingConfig && (
                  <p
                    className={`text-xs mt-2 px-3 py-1.5 rounded-md ${
                      theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-300 border border-blue-700'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <strong>New Service:</strong> Configure pricing to activate this service
                  </p>
                )}
              </div>
            </div>
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
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-500 text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Step 1: Base Configurations */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Step 1: Base Configurations
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddBaseConfig(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Plus size={16} />
                  Add Base Configuration
                </button>
              </div>
              <p
                className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Add preset sizes or custom options that customers can choose
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(pricingConfig.baseConfigurations || []).map((config, index) => (
                  <div
                    key={config.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {editingBaseConfig === index ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.name}
                          onChange={(e) =>
                            updateBaseConfiguration(index, { name: e.target.value })
                          }
                          className={`w-full p-2 rounded-md border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                        />
                        <select
                          value={config.type}
                          onChange={(e) =>
                            updateBaseConfiguration(index, {
                              type: e.target.value as 'PRESET' | 'CUSTOM',
                            })
                          }
                          className={`w-full p-2 rounded-md border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                        >
                          <option value="PRESET">Preset</option>
                          <option value="CUSTOM">Custom</option>
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          value={config.unitPrice}
                          onChange={(e) =>
                            updateBaseConfiguration(index, {
                              unitPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className={`w-full p-2 rounded-md border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateBaseConfiguration(index, {})}
                            className="flex-1 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-medium"
                          >
                            <Check size={16} className="inline mr-1" />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingBaseConfig(null)}
                            className="px-3 py-1.5 rounded-md border text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4
                              className={`font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              {config.name}
                            </h4>
                            <p
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              ₵{config.unitPrice.toFixed(2)} per page
                            </p>
                            {config.type === 'CUSTOM' && config.customValue && (
                              <p
                                className={`text-xs mt-1 ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                }`}
                              >
                                Value: {config.customValue}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingBaseConfig(index)}
                              className={`p-1.5 rounded-md transition-colors ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-600 text-gray-300'
                                  : 'hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBaseConfiguration(index)}
                              className={`p-1.5 rounded-md transition-colors ${
                                theme === 'dark'
                                  ? 'hover:bg-red-900/30 text-red-400'
                                  : 'hover:bg-red-50 text-red-600'
                              }`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Step 2: Options */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Step 2: Options
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddOption(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Plus size={16} />
                  Add Option
                </button>
              </div>
              <p
                className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Configure standard options with default states and modifiers
              </p>
              <div className="space-y-3">
                {(pricingConfig.options || []).map((option, index) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } ${option.default ? 'ring-2 ring-amber-400/50' : ''}`}
                  >
                    {editingOption === index ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateOption(index, { name: e.target.value })}
                          className={`w-full p-2 rounded-md border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                        />
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={option.enabled}
                              onChange={(e) => updateOption(index, { enabled: e.target.checked })}
                              className="cursor-pointer"
                            />
                            <span
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              Enabled
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={option.default}
                              onChange={(e) => updateOption(index, { default: e.target.checked })}
                              className="cursor-pointer"
                            />
                            <span
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              Default
                            </span>
                          </label>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          value={option.priceModifier}
                          onChange={(e) =>
                            updateOption(index, { priceModifier: parseFloat(e.target.value) || 0 })
                          }
                          className={`w-full p-2 rounded-md border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateOption(index, {})}
                            className="flex-1 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-medium"
                          >
                            <Check size={16} className="inline mr-1" />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingOption(null)}
                            className="px-3 py-1.5 rounded-md border text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4
                              className={`font-semibold ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              {option.name}
                            </h4>
                            {option.default && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                Default
                              </span>
                            )}
                            {!option.enabled && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            Price Modifier: ₵{option.priceModifier.toFixed(2)} per page
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingOption(index)}
                            className={`p-1.5 rounded-md transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-600 text-gray-300'
                                : 'hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className={`p-1.5 rounded-md transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-red-900/30 text-red-400'
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Step 3: Custom Specifications */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Step 3: Custom Specifications
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddCustomSpec(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Plus size={16} />
                  Add Custom Specification
                </button>
              </div>
              <p
                className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Add optional extras that customers can select
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(pricingConfig.customSpecifications || []).map((spec, index) => (
                  <div
                    key={spec.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {editingCustomSpec === index ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => updateCustomSpecification(index, { name: e.target.value })}
                          className={`w-full p-2 rounded-md border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={spec.priceModifier}
                          onChange={(e) =>
                            updateCustomSpecification(index, {
                              priceModifier: parseFloat(e.target.value) || 0,
                            })
                          }
                          className={`w-full p-2 rounded-md border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-600 text-gray-100'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateCustomSpecification(index, {})}
                            className="flex-1 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-medium"
                          >
                            <Check size={16} className="inline mr-1" />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCustomSpec(null)}
                            className="px-3 py-1.5 rounded-md border text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h4
                            className={`font-semibold mb-1 ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}
                          >
                            {spec.name}
                          </h4>
                          <p
                            className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            Price Modifier: ₵{spec.priceModifier.toFixed(2)} per page
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingCustomSpec(index)}
                            className={`p-1.5 rounded-md transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-600 text-gray-300'
                                : 'hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCustomSpecification(index)}
                            className={`p-1.5 rounded-md transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-red-900/30 text-red-400'
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {pricingConfig.customSpecifications.length === 0 && (
                  <p
                    className={`text-sm text-center py-8 col-span-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    No custom specifications. Click "Add Custom Specification" to create one.
                  </p>
                )}
              </div>
            </section>

            {/* Preview Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Configuration Preview
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Eye size={16} />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
              {showPreview && (
                <div
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      <h4
                        className={`font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        Base Configurations:
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {(pricingConfig.baseConfigurations || []).map((config) => (
                          <li
                            key={config.id}
                            className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {config.name} - ₵{config.unitPrice.toFixed(2)}/page
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4
                        className={`font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        Options:
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {(pricingConfig.options || []).map((option) => (
                          <li
                            key={option.id}
                            className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {option.name}
                            {option.default && ' (Default)'} -{' '}
                            {option.priceModifier > 0
                              ? `+₵${option.priceModifier.toFixed(2)}/page`
                              : 'No additional cost'}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4
                        className={`font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        Custom Specifications:
                      </h4>
                      {(pricingConfig.customSpecifications || []).length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {(pricingConfig.customSpecifications || []).map((spec) => (
                            <li
                              key={spec.id}
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              {spec.name} - +₵{spec.priceModifier.toFixed(2)}/page
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          No custom specifications
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-300 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-md border text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-md border text-sm font-medium transition-colors ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'border-yellow-600 bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400'
                    : 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-md border-none text-sm font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-amber-300 cursor-not-allowed opacity-60'
                  : 'bg-amber-400 hover:bg-amber-500 cursor-pointer'
              } text-gray-900`}
            >
              {isSubmitting ? 'Saving...' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddBaseConfigDialog
        isOpen={showAddBaseConfig}
        onClose={() => setShowAddBaseConfig(false)}
        onAdd={addBaseConfiguration}
        theme={theme}
      />
      <AddOptionDialog
        isOpen={showAddOption}
        onClose={() => setShowAddOption(false)}
        onAdd={addOption}
        theme={theme}
      />
      <AddCustomSpecDialog
        isOpen={showAddCustomSpec}
        onClose={() => setShowAddCustomSpec(false)}
        onAdd={addCustomSpecification}
        theme={theme}
      />
    </>
  );
}
