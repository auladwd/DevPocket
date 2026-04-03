// Core entry type used across the app
export interface Entry {
  _id?: string;
  userId: string;
  title: string;
  content: string; // code snippet or text
  url?: string; // optional link
  password?: string; // optional, stored encrypted
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form data (password is plaintext before encryption)
export interface EntryFormData {
  title: string;
  content: string;
  url?: string;
  password?: string;
  tags: string[];
  pinned?: boolean;
}
