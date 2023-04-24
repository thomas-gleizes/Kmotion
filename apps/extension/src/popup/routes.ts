import LoginScreen from "./screens/LoginScreen"
import VideoScreen from "./screens/authed/VideoScreen"
import SettingsScreen from "./screens/authed/SettingsScreen"
import UnAuthLayout from "./layouts/UnAuthLayout"
import AuthLayout from "./layouts/AuthLayout"

export const routes = {
  login: {
    name: "login",
    screen: LoginScreen,
    root: UnAuthLayout,
    needAuth: false,
    default: true,
  },
  video: {
    name: "video",
    screen: VideoScreen,
    root: AuthLayout,
    needAuth: true,
    default: true,
  },
  test: {
    name: "test",
    screen: SettingsScreen,
    root: AuthLayout,
    needAuth: true,
    default: false,
  },
  settings: {
    name: "settings",
    screen: SettingsScreen,
    root: AuthLayout,
    needAuth: true,
    default: false,
  },
}
