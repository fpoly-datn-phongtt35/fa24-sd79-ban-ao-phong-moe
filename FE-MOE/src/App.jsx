// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import "regenerator-runtime/runtime";
import { CommonProvider } from "./context/CommonContext";
import RouterProvider from "./routers/RouterProvider";

function App() {
  return (
    <CommonProvider>
      <RouterProvider />
    </CommonProvider>
  );
}
export default App;
