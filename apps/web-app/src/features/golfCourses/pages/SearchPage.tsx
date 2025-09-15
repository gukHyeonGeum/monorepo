import { useEffect, useRef } from 'react';
import type { GolfCourse } from '@/features/golfCourses/domain/types';
import { ChevronLeftIcon, SearchIcon, XIcon, ChevronRightIcon } from '@/shared/components/icons';
import { useGolfStore, type GolfState } from '@/shared/store/createStore';

const SearchPage = () => {
  const searchQuery = useGolfStore((state: GolfState) => state.searchQuery);
  const searchResults = useGolfStore((state: GolfState) => state.searchResults);
  const recentSearches = useGolfStore((state: GolfState) => state.recentSearches);
  const allGolfCourses = useGolfStore((state: GolfState) => state.allGolfCourses);
  const backFromSearch = useGolfStore((state: GolfState) => state.backFromSearch);
  const setSearchQuery = useGolfStore((state: GolfState) => state.setSearchQuery);
  const selectSearchResult = useGolfStore((state: GolfState) => state.selectSearchResult);
  const removeRecentSearch = useGolfStore((state: GolfState) => state.removeRecentSearch);
  const clearRecentSearches = useGolfStore((state: GolfState) => state.clearRecentSearches);
  const selectRecentSearch = useGolfStore((state: GolfState) => state.selectRecentSearch);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const showInitialContent = searchQuery.trim() === '';
  const popularCourses = allGolfCourses.slice(0, 3);

  return (
    <div className="absolute inset-0 bg-white z-30 font-sans flex flex-col">
      {/* Search Bar */}
      <header className="flex items-center p-4 bg-white border-b sticky top-0 z-10 flex-shrink-0">
        <button onClick={backFromSearch} aria-label="Go back">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <div className="relative flex-1 ml-4">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="골프장명, 코스명, 지역명을 입력해보세요"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-2xl focus:outline-none"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {showInitialContent ? (
          <InitialSearchView
            recentSearches={recentSearches}
            onRemoveRecent={removeRecentSearch}
            onClearRecent={clearRecentSearches}
            onSelectRecent={selectRecentSearch}
            popularCourses={popularCourses}
            onSelectPopular={selectSearchResult}
          />
        ) : (
          <SearchResultsView results={searchResults} onSelectResult={selectSearchResult} />
        )}
      </main>
    </div>
  );
};

// --- Sub-components for better organization ---

const InitialSearchView = ({
  recentSearches,
  onRemoveRecent,
  onClearRecent,
  onSelectRecent,
  popularCourses,
  onSelectPopular,
}: {
  recentSearches: string[];
  onRemoveRecent: (index: number) => void;
  onClearRecent: () => void;
  onSelectRecent: (term: string) => void;
  popularCourses: GolfCourse[];
  onSelectPopular: (course: GolfCourse) => void;
}) => (
  <div>
    {/* Recent Searches */}
    {recentSearches.length > 0 && (
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">최근 검색어</h2>
          <button onClick={onClearRecent} className="text-sm text-gray-500">
            전체삭제
          </button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-2">
          {recentSearches.map((term, index) => (
            <div
              key={term}
              className="flex-shrink-0 flex items-center bg-gray-100 rounded-full pl-4 pr-2 py-1.5"
            >
              <span onClick={() => onSelectRecent(term)} className="cursor-pointer text-gray-700">
                {term}
              </span>
              <button
                onClick={() => onRemoveRecent(index)}
                className="ml-2 text-gray-400 hover:text-gray-700"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Popular Golf Courses */}
    <div className="p-4 mt-4">
      <h2 className="text-lg font-bold mb-4">인기 골프장</h2>
      <div className="grid grid-cols-3 gap-4">
        {popularCourses.map((course: GolfCourse) => (
          <div
            key={course.GOLF_PLC_NO}
            className="cursor-pointer"
            onClick={() => onSelectPopular(course)}
          >
            {/* <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img src={course.images[0]} alt={course.name} className="w-full h-full object-cover" />
            </div> */}
            <h3 className="font-semibold mt-2 truncate">{course.GOLF_PLC_NM}</h3>
            <p className="text-sm text-gray-500">{course.ADDR_TRANS}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SearchResultsView = ({
  results,
  onSelectResult,
}: {
  results: GolfCourse[];
  onSelectResult: (course: GolfCourse) => void;
}) => (
  <div>
    {results.length > 0 ? (
      results.map((course) => (
        <button
          key={course.GOLF_PLC_NO}
          onClick={() => onSelectResult(course)}
          className="w-full flex justify-between items-center text-left px-4 py-4 border-b hover:bg-gray-50"
        >
          <div>
            <h3 className="font-semibold text-gray-800">{course.GOLF_PLC_NM}</h3>
            <p className="text-sm text-gray-500">{course.ADDR_TRANS}</p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </button>
      ))
    ) : (
      <div className="text-center py-20 text-gray-500">
        <p>검색 결과가 없습니다.</p>
      </div>
    )}
  </div>
);

export default SearchPage;
