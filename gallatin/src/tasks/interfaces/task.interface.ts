export interface Task {
  id: string;
  parentId?: string | null;
  title: string;
  description: string;
}
