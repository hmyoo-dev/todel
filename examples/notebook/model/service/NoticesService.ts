import { NoticesAtom } from "../atom/notice/NoticesAtom";
import { Notice } from "../dataTypes";

export type NotificationState = Notice[];

export class NoticesService {
  constructor(private notices: NoticesAtom) {}

  notify(message: string): void {
    const id = this.notices.push(message);
    setTimeout(() => this.notices.delete(id), 2000);
  }
}
