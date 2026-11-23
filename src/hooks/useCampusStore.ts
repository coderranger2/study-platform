import { useCampus } from '../context/CampusContext';

/**
 * useCampusStore hook
 * Standardized store hook providing complete reactive state and actions
 * for CampusOS 98 window management, rooms, audio, quests, shop, and study tools.
 */
export const useCampusStore = () => {
  return useCampus();
};

export default useCampusStore;
