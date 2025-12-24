import { useTheme } from '../../../../contexts/ThemeContext';
import type { ServiceCategory } from '../../../../types';

interface CategoriesViewProps {
  categories: ServiceCategory[];
  onCategorySelect: (category: ServiceCategory) => void;
}

export function CategoriesView({ categories, onCategorySelect }: CategoriesViewProps) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-lg border p-6 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <h2 className={`text-lg font-semibold m-0 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Select a Category
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-medium uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            Read-Only
          </span>
        </div>
        <p className={`text-sm m-0 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Categories are platform-owned. Browse to find services for your branch.
        </p>
      </div>
      {categories.length === 0 ? (
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          No categories available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category)}
              className={`p-0 rounded-lg border text-left transition-all duration-200 flex flex-col overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 hover:border-amber-400 hover:bg-gray-700/50'
                  : 'bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-50/50'
              }`}
            >
              {category.imageUrl && (
                <div className="w-full h-[180px] flex-shrink-0 relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
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
                  {category.name}
                </h3>
                {category.description && (
                  <p className={`text-sm m-0 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

