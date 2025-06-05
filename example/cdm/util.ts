import { CozeMessageEnum, CozeMessageI } from './define';

export function parseSSEData(rawData: string) {
  const events: CozeMessageI[] = [];
  const lines = rawData.split('\n');
  let currentEvent: Partial<CozeMessageI> = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; // Ignore empty lines

    // Parse event line
    if (trimmedLine.startsWith('event:')) {
      currentEvent.type = trimmedLine.trim() as CozeMessageEnum;
    } else if (trimmedLine.startsWith('data:')) {
      // Parse data line
      try {
        const jsonString = trimmedLine.slice(5).trim();
        currentEvent.data = JSON.parse(jsonString);
        events.push(currentEvent as CozeMessageI); // Save complete event
        currentEvent = {}; // Reset temporary object
      } catch (e) {
        console.error('JSON parse failed:', e);
      }
    }
  }

  return events;
}
