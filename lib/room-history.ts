interface RoomHistoryEntry {
  code: string;
  name: string;
  lastVisited: number;
}

const ROOM_HISTORY_KEY = 'room-history';
const MAX_HISTORY_ITEMS = 3;

export function addToRoomHistory(code: string, name: string) {
  if (typeof window === 'undefined') return;

  const history = getRoomHistory();
  const newEntry: RoomHistoryEntry = {
    code,
    name,
    lastVisited: Date.now(),
  };

  // Remove existing entry if present
  const filteredHistory = history.filter(entry => entry.code !== code);
  
  // Add new entry at the beginning
  const updatedHistory = [newEntry, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(ROOM_HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function getRoomHistory(): RoomHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const history = localStorage.getItem(ROOM_HISTORY_KEY);
    if (!history) return [];
    
    return JSON.parse(history);
  } catch {
    return [];
  }
}

export function clearRoomHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ROOM_HISTORY_KEY);
} 