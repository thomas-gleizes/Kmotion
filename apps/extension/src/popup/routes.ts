import LoginScreen from "./screens/LoginScreen"
import VideoScreen from "./screens/VideoScreen"
import UnAuthLayout from "./layouts/UnAuthLayout"
import AuthLayout from "./layouts/AuthLayout"

export const routes: Record<string, Route> = {
  login: {
    name: "login",
    screen: LoginScreen,
    root: UnAuthLayout,
    needAuth: false,
    default: true,
  },
  convert: {
    name: "video",
    screen: VideoScreen,
    root: AuthLayout,
    default: true,
    needAuth: true,
  },
}
