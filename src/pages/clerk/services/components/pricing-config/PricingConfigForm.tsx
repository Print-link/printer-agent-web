import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { usePricingConfig } from './hooks/usePricingConfig';
import { usePricingConfigForm } from './hooks/usePricingConfigForm';
import { PricingConfigHeader } from './components/PricingConfigHeader';
import { BaseConfigurationsSection } from './components/BaseConfigurationsSection';
import { OptionsSection } from './components/OptionsSection';
import { CustomSpecificationsSection } from './components/CustomSpecificationsSection';
import { ConfigurationPreview } from './components/ConfigurationPreview';
import { PricingConfigActions } from './components/PricingConfigActions';
import { AddBaseConfigDialog, AddOptionDialog, AddCustomSpecDialog } from './dialogs';
import type { AgentService, BaseConfiguration, CustomSpecification, PricingOption } from '../../../../../types';

interface PricingConfigFormProps {
  isOpen: boolean;
  agentService: AgentService;
  onClose: () => void;
  onSuccess: () => void;
}

export function PricingConfigForm({
  isOpen,
  agentService,
  onClose,
  onSuccess,
}: PricingConfigFormProps) {
  const { theme } = useTheme();
  
  // Section expansion states
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const [isCustomSpecsExpanded, setIsCustomSpecsExpanded] = useState(false);
  
  // Dialog states
  const [showAddBaseConfig, setShowAddBaseConfig] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  const [showAddCustomSpec, setShowAddCustomSpec] = useState(false);
  const [checkedBaseConfigs, setCheckedBaseConfigs] = useState<Set<number>>(new Set());
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [editingCustomSpec, setEditingCustomSpec] = useState<number | null>(null);

  // Custom hooks
  const {
    pricingConfig,
    addBaseConfiguration,
    updateBaseConfiguration,
    removeBaseConfiguration,
    addOption,
    updateOption,
    removeOption,
    addCustomSpecification,
    updateCustomSpecification,
    removeCustomSpecification,
  } = usePricingConfig(agentService, isOpen);

  const { isSubmitting, error, handleSave } = usePricingConfigForm(agentService, onSuccess, onClose);

  if (!isOpen) return null;

  const handleToggleBaseConfig = (index: number, checked: boolean) => {
    const newChecked = new Set(checkedBaseConfigs);
    if (checked) {
      newChecked.add(index);
    } else {
      newChecked.delete(index);
    }
    setCheckedBaseConfigs(newChecked);
  };

  const handleUpdateBaseConfig = (index: number, updates: Partial<BaseConfiguration>) => {
    updateBaseConfiguration(index, updates);
  };

  const handleUpdateOption = (index: number, updates: Partial<PricingOption>) => {
    updateOption(index, updates);
    setEditingOption(null);
  };

  const handleUpdateCustomSpec = (index: number, updates: Partial<CustomSpecification>) => {
    updateCustomSpecification(index, updates);
    setEditingCustomSpec(null);
  };

  const SectionHeader = ({ title, isExpanded, onToggle, count, description }: { title: string, isExpanded: boolean, onToggle: () => void, count?: number, description?: string }) => (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between py-4 border-b ${
        theme === 'dark' ? 'border-gray-800 text-gray-400 hover:text-gray-300' : 'border-gray-100 text-gray-500 hover:text-gray-700'
      } transition-colors group`}
    >
      <div className="flex items-center gap-3">
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        {count !== undefined && count > 0 && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
          }`}>
            {count}
          </span>
        )}
        <span className="text-[12px] text-gray-500" title={description}>{description}</span>
      </div>
    </button>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 ${
          theme === 'dark' ? 'bg-gray-900 font-sans' : 'bg-gray-50 font-sans'
        }`}
      >
        <div className="flex flex-col h-full max-w-[1400px] mx-auto w-full">
          <PricingConfigHeader agentService={agentService} theme={theme} onClose={onClose} />

          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto px-6 py-8">
              <div className="max-w-3xl mx-auto">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-xs mb-6 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-bold">{error}</span>
                  </div>
                )}

                <div className="space-y-8 pb-20">
                  {/* Base Pricing Section - Always Expanded */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <BaseConfigurationsSection
                      baseConfigurations={pricingConfig.baseConfigurations || []}
                      checkedIndices={checkedBaseConfigs}
                      theme={theme}
                      onAdd={() => setShowAddBaseConfig(true)}
                      onToggle={handleToggleBaseConfig}
                      onUpdate={handleUpdateBaseConfig}
                      onDelete={removeBaseConfiguration}
                    />
                  </div>

                  {/* Standard Options Section */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
                    <SectionHeader 
                      title="Standard Options" 
                      description="Configure standard options with price modifiers i.e. paper size, paper type, paper color, etc."
                      isExpanded={isOptionsExpanded} 
                      onToggle={() => setIsOptionsExpanded(!isOptionsExpanded)}
                      count={pricingConfig.options?.length}
                    />
                    {isOptionsExpanded && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <OptionsSection
                          options={pricingConfig.options || []}
                          editingIndex={editingOption}
                          theme={theme}
                          onAdd={() => setShowAddOption(true)}
                          onEdit={setEditingOption}
                          onUpdate={handleUpdateOption}
                          onCancelEdit={() => setEditingOption(null)}
                          onDelete={removeOption}
                        />
                      </div>
                    )}
                  </div>

                  {/* Specifics Section */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-300">
                    <SectionHeader 
                      title="Custom Specifications" 
                      description="Configure extra Add-on with price modifiers i.e. Brown envelope, Lamination, etc."
                      isExpanded={isCustomSpecsExpanded} 
                      onToggle={() => setIsCustomSpecsExpanded(!isCustomSpecsExpanded)}
                      count={pricingConfig.customSpecifications?.length}
                    />
                    {isCustomSpecsExpanded && (
                      <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <CustomSpecificationsSection
                          customSpecifications={pricingConfig.customSpecifications || []}
                          editingIndex={editingCustomSpec}
                          theme={theme}
                          onAdd={() => setShowAddCustomSpec(true)}
                          onEdit={setEditingCustomSpec}
                          onUpdate={handleUpdateCustomSpec}
                          onCancelEdit={() => setEditingCustomSpec(null)}
                          onDelete={removeCustomSpecification}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>

            {/* Live Summary Sidebar */}
            <aside className={`w-80 flex-shrink-0 border-l px-6 py-8 hidden xl:block ${theme === 'dark' ? 'border-gray-800 bg-gray-900/40' : 'border-gray-200 bg-white'}`}>
              <div className="sticky top-0">
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-1 h-1 rounded-full bg-blue-500 animate-pulse`} />
                  <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Live Summary
                  </h4>
                </div>
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gray-800/20 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <ConfigurationPreview
                    pricingConfig={pricingConfig}
                    theme={theme}
                  />
                </div>
              </div>
            </aside>
          </div>

          <PricingConfigActions
            theme={theme}
            isSubmitting={isSubmitting}
            onClose={onClose}
            onSaveDraft={() => handleSave(pricingConfig, false)}
            onSaveAndActivate={() => handleSave(pricingConfig, true)}
          />
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
