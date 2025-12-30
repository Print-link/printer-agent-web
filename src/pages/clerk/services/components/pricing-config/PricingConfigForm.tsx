import { useState } from 'react';
import { Layers, ListChecks, Settings, Eye } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { usePricingConfig } from './hooks/usePricingConfig';
import { usePricingConfigForm } from './hooks/usePricingConfigForm';
import { PricingConfigHeader } from './components/PricingConfigHeader';
import { PricingConfigSidebar } from './components/PricingConfigSidebar';
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

const STEPS = [
  {
    id: 1,
    title: 'Base Configuration',
    description: 'Setup pricing models',
    icon: Layers,
  },
  {
    id: 2,
    title: 'Options & Extras',
    description: 'Add finishing options',
    icon: ListChecks,
  },
  {
    id: 3,
    title: 'Custom Specifications',
    description: 'Define user inputs',
    icon: Settings,
  },
  {
    id: 4,
    title: 'Review & Activate',
    description: 'Preview and save',
    icon: Eye,
  },
];

export function PricingConfigForm({
  isOpen,
  agentService,
  onClose,
  onSuccess,
}: PricingConfigFormProps) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  
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

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5"
        onClick={onClose}
      >
        <div
          className={`flex flex-col rounded-lg max-w-5xl w-full h-[85vh] shadow-2xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <PricingConfigHeader agentService={agentService} theme={theme} onClose={onClose} />

          <div className="flex flex-1 overflow-hidden">
            <PricingConfigSidebar
              currentStep={currentStep}
              steps={STEPS}
              theme={theme}
              onStepClick={setCurrentStep}
            />

            <div className={`flex-1 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">

                  <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {STEPS[currentStep - 1].title}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {STEPS[currentStep - 1].description}
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {currentStep === 1 && (
                    <BaseConfigurationsSection
                      baseConfigurations={pricingConfig.baseConfigurations || []}
                      checkedIndices={checkedBaseConfigs}
                      theme={theme}
                      onAdd={() => setShowAddBaseConfig(true)}
                      onToggle={handleToggleBaseConfig}
                      onUpdate={handleUpdateBaseConfig}
                      onDelete={removeBaseConfiguration}
                    />
                  )}

                  {currentStep === 2 && (
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
                  )}

                  {currentStep === 3 && (
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
                  )}

                  {currentStep === 4 && (
                    <ConfigurationPreview
                      pricingConfig={pricingConfig}
                      showPreview={true}
                      theme={theme}
                      onToggle={() => {}}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <PricingConfigActions
            theme={theme}
            isSubmitting={isSubmitting}
            currentStep={currentStep}
            totalSteps={STEPS.length}
            onClose={onClose}
            onNext={handleNext}
            onBack={handleBack}
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

