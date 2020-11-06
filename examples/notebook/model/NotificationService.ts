import { Service } from "todel";
import { Notification } from "./dataTypes";

export type NotificationState = Notification[];

export class NotificationService extends Service<NotificationState> {
  private itemId: number;

  constructor() {
    super([]);
    this.itemId = 0;
  }

  notify(message: string): void {
    const id = this.itemId++;
    const newItem: Notification = { id, message };
    this.updateState((items) => [...items, newItem]);
    setTimeout(
      () => this.updateState((items) => items.filter((item) => item.id !== id)),
      2000
    );
  }
}

export type NotificationServiceHolder = {
  notificationService: NotificationService;
};

export function selectNotificationService(
  repo: NotificationServiceHolder
): NotificationService {
  return repo.notificationService;
}
