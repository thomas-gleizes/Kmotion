import LoginScreen from "./screens/LoginScreen"
import VideoScreen from "./screens/VideoScreen"

export const routes = {
  login: {
    name: "login",
    screen: LoginScreen,
  },
  convert: {
    name: "video",
    screen: VideoScreen,
    default: true,
  },
}
