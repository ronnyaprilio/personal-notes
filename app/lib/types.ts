export interface INote {
  _id?: string;
  notes_id: string;
  description: string;
  content: string;
  keyword: string[];
  is_sensitive: boolean;
  dates: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INoteForm {
  notes_id: string;
  description: string;
  content: string;
  keyword: string;
  is_sensitive: boolean;
  dates: string;
}

export interface SearchParams {
  query?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}