import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  GolfCourse,
  Filters,
  SortOption,
  TeeTimes,
} from '@/features/golfCourses/domain/types';
import type { Booking } from '@/features/golfCourseBookings/domain/types';
import { formatYmd, getMonthsRange } from '@/shared/utils/date';
import { showToast } from '../utils/toast';

const PAGE_SIZE = 20;

const initialFilters: Filters = {
  regions: [],
  teeTimes: [],
  greenFees: [],
  players: [],
  paymentMethods: [],
};

type View =
  | 'list'
  | 'detail'
  | 'reservation'
  | 'terms'
  | 'history'
  | 'bookingDetail'
  | 'cancellationComplete'
  | 'search';

const applyAllFiltersAndSorts = (
  courses: GolfCourse[],
  filters: Filters,
  sortOption: SortOption
): GolfCourse[] => {
  let processedCourses = [...courses];

  // Filtering logic
  if (filters.regions.length > 0) {
    const expandedFilter = filters.regions.flatMap((f) => f.split(' / '));
    processedCourses = processedCourses.filter((course) => {
      return expandedFilter.some((f) => course.ADDR_TRANS.includes(f));
    });
  }
  if (filters.teeTimes.length > 0) {
    processedCourses = processedCourses.filter((course) =>
      filters.teeTimes.some((timeRange) =>
        course.TIME_LIST.some((tt) => {
          const hour = parseInt(tt.BOOK_TM.split(':')[0]!, 10);
          if (timeRange === '새벽 ~7시' && hour < 7) return true;
          if (timeRange === '오전 7-12시' && hour >= 7 && hour < 12) return true;
          if (timeRange === '오후 12-16시' && hour >= 12 && hour < 16) return true;
          if (timeRange === '야간 16~' && hour >= 16) return true;
          return false;
        })
      )
    );
  }
  if (filters.greenFees.length > 0) {
    processedCourses = processedCourses.filter((course) =>
      filters.greenFees.some((feeRange) => {
        const price = course.MIN_SALE_FEE;
        if (feeRange === '~5만원' && price < 50000) return true;
        if (feeRange === '5~10만원' && price >= 50000 && price < 100000) return true;
        if (feeRange === '10~15만원' && price >= 100000 && price < 150000) return true;
        if (feeRange === '15만원~' && price >= 150000) return true;
        return false;
      })
    );
  }
  // if (filters.players.length > 0) {
  //     processedCourses = processedCourses.filter(course =>
  //         filters.players.some(p => [course.playerOptions].includes(p))
  //     );
  // }
  // if (filters.paymentMethods.length > 0) {
  //     processedCourses = processedCourses.filter(course =>
  //         filters.paymentMethods.some(pm => course.paymentOptions.includes(pm))
  //     );
  // }

  // Sorting logic
  switch (sortOption) {
    case 'teeTime':
      processedCourses.sort((a, b) =>
        (a.TIME_LIST[0]?.BOOK_TM || '23:59').localeCompare(b.TIME_LIST[0]?.BOOK_TM || '23:59')
      );
      break;
    case 'name':
      processedCourses.sort((a, b) => a.GOLF_PLC_NM.localeCompare(b.GOLF_PLC_NM, 'ko'));
      break;
    case 'default':
    default:
      processedCourses.sort((a, b) => a.MIN_SALE_FEE - b.MIN_SALE_FEE);
      break;
  }

  return processedCourses;
};

export interface GolfState {
  // --- Core Data State ---
  selectedDate: Date;
  availableMonths: Date[];
  allGolfCourses: GolfCourse[]; // Raw from API for the date
  processedCourses: GolfCourse[]; // Filtered and sorted
  golfCourses: GolfCourse[]; // Paginated for display
  bookings: Booking[];

  // --- UI and Interaction State ---
  currentView: View;
  loadingMore: boolean;
  hasMore: boolean;
  expandedCourseId: number | null;

  // --- Modal State ---
  isFilterModalOpen: boolean;
  isSortModalOpen: boolean;
  isCancelReasonModalOpen: boolean;
  bookingConfirmedDetails: { course: GolfCourse; teeTime: TeeTimes; bookingId: string } | null;

  // --- Page-specific Data ---
  selectedCourse: GolfCourse | null;
  reservationDetails: { course: GolfCourse; teeTime: TeeTimes } | null;
  viewingTerms: 'cancellation' | 'privacy' | null;
  selectedBooking: Booking | null;
  initialHistoryTab: 'rounds' | 'cancelled';

  // --- Filter & Sort State ---
  filters: Filters;
  sortOption: SortOption;

  // --- Search State ---
  searchQuery: string;
  searchResults: GolfCourse[];
  recentSearches: string[];

  // --- Actions ---
  setAllGolfCourses: (courses: GolfCourse[]) => void;
  loadMoreCourses: () => void;
  setSelectedDate: (date: Date) => void;

  applyFilters: (newFilters: Filters) => void;
  resetFilters: () => void;
  applySort: (newSortOption: SortOption) => void;
  resetSort: () => void;

  toggleCourse: (id: number) => void;

  setView: (view: View) => void;

  selectCourse: (course: GolfCourse) => void;
  backToList: () => void;

  startReservation: (teeTime: TeeTimes) => void;

  viewTerms: (type: 'cancellation' | 'privacy') => void;
  backToReservation: () => void;

  confirmBooking: (bookingId: string) => void;

  setBookings: (booking: Booking[]) => void;
  viewHistory: () => void;
  closeBookingConfirmation: () => void;

  viewBookingDetail: (booking: Booking) => void;
  backToHistory: () => void;

  closeCancelReasonModal: () => void;
  selectCancellationReason: () => void;
  viewCancellationHistory: () => void;

  copyToClipboard: (text: string) => void;

  // --- Search Actions ---
  goToSearch: () => void;
  backFromSearch: () => void;
  setSearchQuery: (query: string) => void;
  selectSearchResult: (course: GolfCourse) => void;
  selectRecentSearch: (term: string) => void;
  removeRecentSearch: (index: number) => void;
  clearRecentSearches: () => void;

  // --- Modal Toggles ---
  toggleFilterModal: (isOpen: boolean) => void;
  toggleSortModal: (isOpen: boolean) => void;
}

export const useGolfStore = create(
  persist(
    immer<GolfState>((set, get) => {
      const updateProcessedCourses = () => {
        const { allGolfCourses, filters, sortOption } = get();
        const processed = applyAllFiltersAndSorts(allGolfCourses, filters, sortOption);
        const paginated = processed.slice(0, PAGE_SIZE);
        set((state) => {
          state.processedCourses = processed;
          state.golfCourses = paginated;
          state.hasMore = processed.length > PAGE_SIZE;
        });
      };

      return {
        // --- Initial State ---
        selectedDate: new Date(),
        availableMonths: getMonthsRange(new Date(), 3),
        allGolfCourses: [],
        processedCourses: [],
        golfCourses: [],
        bookings: [],
        currentView: 'list',
        loadingMore: false,
        hasMore: false,
        expandedCourseId: null,
        isFilterModalOpen: false,
        isSortModalOpen: false,
        isCancelReasonModalOpen: false,
        bookingConfirmedDetails: null,
        selectedCourse: null,
        reservationDetails: null,
        viewingTerms: null,
        selectedBooking: null,
        initialHistoryTab: 'rounds',
        filters: initialFilters,
        sortOption: 'default',
        toast: { show: false, message: '', position: 'bottom' },
        searchQuery: '',
        searchResults: [],
        recentSearches: ['아세코밸리', '휘슬링락', '우정힐스', '화순CC', '스카이72'],

        // --- Actions ---
        setAllGolfCourses: (courses) => {
          set((state) => {
            state.allGolfCourses = courses;
            // if (courses.length > 0) {
            //   state.expandedCourseId = courses[0]!.GOLF_PLC_NO;
            // } else {
            //   state.expandedCourseId = null;
            // }
          });
          updateProcessedCourses();
        },

        setSelectedDate: (date) => {
          set((state) => {
            state.selectedDate = date;
          });
        },

        loadMoreCourses: () => {
          const { loadingMore, hasMore, golfCourses, processedCourses } = get();
          if (loadingMore || !hasMore) return;

          set({ loadingMore: true });

          setTimeout(() => {
            const currentLength = golfCourses.length;
            const nextCourses = processedCourses.slice(currentLength, currentLength + PAGE_SIZE);
            set((state) => {
              state.golfCourses.push(...nextCourses);
              state.hasMore = state.processedCourses.length > currentLength + PAGE_SIZE;
              state.loadingMore = false;
            });
          }, 500);
        },

        applyFilters: (newFilters) => {
          set({ filters: newFilters, isFilterModalOpen: false });
          updateProcessedCourses();
        },
        resetFilters: () => {
          set({ filters: initialFilters });
          updateProcessedCourses();
        },
        applySort: (newSortOption) => {
          set({ sortOption: newSortOption, isSortModalOpen: false });
          updateProcessedCourses();
        },
        resetSort: () => {
          set({ sortOption: 'default' });
          updateProcessedCourses();
        },

        toggleCourse: (id) =>
          set((state) => {
            state.expandedCourseId = state.expandedCourseId === id ? null : id;
          }),

        setView: (view) => set({ currentView: view }),

        selectCourse: (course) => set({ selectedCourse: course }),
        backToList: () => set({ selectedCourse: null, currentView: 'list' }),

        startReservation: (teeTime) =>
          set((state) => {
            if (state.selectedCourse) {
              state.reservationDetails = {
                course: { ...state.selectedCourse, BOOK_DT: formatYmd(state.selectedDate) },
                teeTime,
              };
            }
          }),

        viewTerms: (type) => set({ viewingTerms: type, currentView: 'terms' }),
        backToReservation: () => set({ viewingTerms: null, currentView: 'reservation' }),
        confirmBooking: async (bookingId) => {
          const { reservationDetails } = get();
          if (reservationDetails) {
            set((state) => {
              state.bookingConfirmedDetails = {
                course: reservationDetails.course,
                teeTime: reservationDetails.teeTime,
                bookingId,
              };
              state.reservationDetails = null;
            });
          }
        },
        setBookings: (booking) => set({ bookings: booking, currentView: 'history' }),
        viewHistory: () =>
          set({
            bookingConfirmedDetails: null,
            initialHistoryTab: 'rounds',
            currentView: 'history',
          }),
        closeBookingConfirmation: () =>
          set({ bookingConfirmedDetails: null, initialHistoryTab: 'rounds' }),

        viewBookingDetail: (booking) =>
          set({ selectedBooking: booking, currentView: 'bookingDetail' }),
        backToHistory: () => set({ selectedBooking: null, currentView: 'history' }),

        closeCancelReasonModal: () => set({ isCancelReasonModalOpen: false }),
        selectCancellationReason: () => {
          const { selectedBooking } = get();
          if (selectedBooking) {
            set((state) => {
              const bookingToUpdate = state.bookings.find((b) => b.id === selectedBooking.id);
              if (bookingToUpdate) {
                bookingToUpdate.status = 2;
              }
              state.isCancelReasonModalOpen = false;
              state.currentView = 'cancellationComplete';
            });
          }
        },
        viewCancellationHistory: () =>
          set({ selectedBooking: null, initialHistoryTab: 'cancelled', currentView: 'history' }),

        copyToClipboard: (text) => {
          navigator.clipboard.writeText(text).then(
            () => {
              showToast({ message: '예약번호가 복사되었습니다.', type: 'success' });
            },
            () => {
              showToast({ message: '복사에 실패했습니다.', type: 'error' });
            }
          );
        },

        // --- Search Actions ---
        goToSearch: () => set({ currentView: 'search' }),
        backFromSearch: () => set({ searchQuery: '', searchResults: [], currentView: 'list' }),

        setSearchQuery: (query) => {
          set({ searchQuery: query });
          if (query.trim() === '') {
            set({ searchResults: [] });
          } else {
            const results = get().allGolfCourses.filter(
              (course) =>
                course.GOLF_PLC_NM.toLowerCase().includes(query.toLowerCase()) ||
                course.ADDR_TRANS.toLowerCase().includes(query.toLowerCase())
            );
            set({ searchResults: results });
          }
        },

        selectSearchResult: (course) => {
          const { searchQuery } = get();
          if (searchQuery.trim() !== '') {
            set((state) => {
              const newSearches = [
                searchQuery,
                ...state.recentSearches.filter((s) => s !== searchQuery),
              ];
              state.recentSearches = newSearches.slice(0, 10);
            });
          }
          set({
            selectedCourse: course,
            currentView: 'detail',
            searchQuery: '',
            searchResults: [],
          });
        },

        selectRecentSearch: (term) => {
          get().setSearchQuery(term);
        },

        removeRecentSearch: (indexToRemove) =>
          set((state) => {
            state.recentSearches = state.recentSearches.filter(
              (_, index) => index !== indexToRemove
            );
          }),

        clearRecentSearches: () => set({ recentSearches: [] }),

        // --- Modal Toggles ---
        toggleFilterModal: (isOpen) => set({ isFilterModalOpen: isOpen }),
        toggleSortModal: (isOpen) => set({ isSortModalOpen: isOpen }),
      };
    }),
    {
      name: 'golf-filter-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: {
          regions: state.filters.regions,
        },
      }),
      merge: (persistedState, currentState) => {
        const typePersistedState = persistedState as Partial<GolfState>;

        if (typePersistedState?.filters?.regions) {
          return {
            ...currentState,
            filters: {
              ...currentState.filters,
              regions: typePersistedState.filters.regions,
            },
          };
        }
        return currentState;
      },
    }
  )
);

// --- Selectors for computed state ---
export const selectIsFilterActive = (state: GolfState) =>
  Object.values(state.filters).some((v) => Array.isArray(v) && v.length > 0);
export const selectIsSortActive = (state: GolfState) => state.sortOption !== 'default';
