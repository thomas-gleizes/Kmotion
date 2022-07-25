import { TIME_DAY, TIME_YEAR } from "resources/constants";

const AUTH_USER_KEY = "user";
const AUTH_TOKEN_KEY = "token";
const AUTH_TIME_KEY = "time";

export default {
  isLoggingIn(): boolean {
    const user = this.getUser();
    if (user) {
      return Object.keys(user).length > 0;
    }

    return false;
  },

  getUser(): User | null {
    this.checkTimeout();
    try {
      const user: User = JSON.parse(localStorage.getItem(AUTH_USER_KEY) as string);

      if (user) return user;
    } catch (e) {}

    return null;
  },

  setUser(user: User, rememberMe: boolean): void {
    this.addTimeout(rememberMe);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  getToken(): string {
    this.checkTimeout();
    return localStorage.getItem(AUTH_TOKEN_KEY) as string;
  },

  setToken: (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  logout(): void {
    localStorage.clear();
  },

  checkTimeout(): boolean {
    const setupTime = parseInt(localStorage.getItem(AUTH_TIME_KEY) as string);

    if (setupTime == null || Date.now() > setupTime) {
      localStorage.clear();
      return false;
    }

    return true;
  },

  addTimeout(rememberMe: boolean): void {
    let timestamp = Date.now();
    if (rememberMe) timestamp += TIME_YEAR;
    else timestamp += TIME_DAY;

    localStorage.setItem(AUTH_TIME_KEY, timestamp.toString());
  },
};
