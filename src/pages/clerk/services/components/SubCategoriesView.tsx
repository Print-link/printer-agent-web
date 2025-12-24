import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { ServiceSubCategory } from '../../../../types';

interface SubCategoriesViewProps {
  subCategories: ServiceSubCategory[];
  onSubCategorySelect: (subCategory: ServiceSubCategory) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function SubCategoriesView({
  subCategories,
  onSubCategorySelect,
  onBack,
  isLoading,
}: SubCategoriesViewProps) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-lg border p-6 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className={`p-2 rounded-md border flex items-center justify-center transition-colors ${
            theme === 'dark'
              ? 'border-gray-600 bg-transparent hover:bg-gray-700 text-gray-300'
              : 'border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700'
          }`}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`text-lg font-semibold m-0 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Select a SubCategory
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              Read-Only
            </span>
          </div>
          <p className={`text-xs m-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            SubCategories are platform-owned
          </p>
        </div>
      </div>
      {isLoading ? (
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Loading subcategories...
        </p>
      ) : subCategories.length === 0 ? (
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          No subcategories available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subCategories.map((subCategory) => (
            <button
              key={subCategory.id}
              onClick={() => onSubCategorySelect(subCategory)}
              className={`p-0 rounded-lg border text-left transition-all duration-200 flex flex-col overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 hover:border-amber-400 hover:bg-gray-700/50'
                  : 'bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-50/50'
              }`}
            >
              {subCategory.imageUrl && (
                <div className="w-full h-[180px] flex-shrink-0 relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={subCategory.imageUrl}
                    alt={subCategory.name}
                    className="w-full h-full object-cover block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-5 flex flex-col gap-2">
                <h3 className={`text-base font-semibold m-0 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {subCategory.name}
                </h3>
                {subCategory.description && (
                  <p className={`text-sm m-0 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {subCategory.description}
                  </p>
                )}
                <div className="flex gap-2 items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {subCategory.pricingType}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

