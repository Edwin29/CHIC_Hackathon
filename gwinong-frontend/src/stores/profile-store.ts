import type { UserProfile } from "../domain/profile";

const STORAGE_KEY = "gwinong.userProfile";

export interface ProfileStore {
  load(): UserProfile | null;
  save(profile: UserProfile): void;
  clear(): void;
}

export const localProfileStore: ProfileStore = {
  load() {
    const rawProfile = window.localStorage.getItem(STORAGE_KEY);

    if (!rawProfile) {
      return null;
    }

    try {
      return JSON.parse(rawProfile) as UserProfile;
    } catch {
      return null;
    }
  },
  save(profile) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};
