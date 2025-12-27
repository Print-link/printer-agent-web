import { useState } from 'react';
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
  const [showPreview, setShowPreview] = useState(false);

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

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
        onClick={onClose}
      >
        <div
          className={`rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto shadow-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <PricingConfigHeader agentService={agentService} theme={theme} onClose={onClose} />

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-500 text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <BaseConfigurationsSection
              baseConfigurations={pricingConfig.baseConfigurations || []}
              checkedIndices={checkedBaseConfigs}
              theme={theme}
              onAdd={() => setShowAddBaseConfig(true)}
              onToggle={handleToggleBaseConfig}
              onUpdate={handleUpdateBaseConfig}
              onDelete={removeBaseConfiguration}
            />

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

            <ConfigurationPreview
              pricingConfig={pricingConfig}
              showPreview={showPreview}
              theme={theme}
              onToggle={() => setShowPreview(!showPreview)}
            />
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

