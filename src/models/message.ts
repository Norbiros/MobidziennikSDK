export interface Message {
  id: string;
  topic: string;
  isStarred: boolean;
  sender: string;
  seen: boolean;
}
