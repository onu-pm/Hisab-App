import { OfflineSyncItem, SourceChannel } from '../types';

const OFFLINE_QUEUE_KEY = 'vyapar_offline_invoices_queue';

export function getOfflineQueue(): OfflineSyncItem[] {
  try {
    const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineSyncItem[]): void {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline queue', e);
  }
}

export function enqueueOfflineInvoice(
  imageDataUrl: string,
  sourceChannel: SourceChannel
): OfflineSyncItem {
  const queue = getOfflineQueue();
  const newItem: OfflineSyncItem = {
    id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    temp_id: `temp-${Date.now()}`,
    image_data_url: imageDataUrl,
    source_channel: sourceChannel,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  queue.push(newItem);
  saveOfflineQueue(queue);
  return newItem;
}

export function removeOfflineItem(id: string): void {
  const queue = getOfflineQueue().filter((item) => item.id !== id);
  saveOfflineQueue(queue);
}

export function updateOfflineItemStatus(
  id: string,
  status: 'pending' | 'syncing' | 'synced' | 'failed',
  error?: string
): void {
  const queue = getOfflineQueue().map((item) => {
    if (item.id === id) {
      return { ...item, status, error };
    }
    return item;
  });
  saveOfflineQueue(queue);
}
