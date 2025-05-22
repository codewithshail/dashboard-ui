export interface PreferenceOption {
    id: string;
    title: string;
    description: string;
    tags: string[];
    icon?: string;
  }
  
  export interface UserPreferences {
    userId: string;
    tags: string[];
    toolIds: string[];
  }
  