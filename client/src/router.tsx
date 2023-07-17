import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
 {
  path: "/",
  element: <div>Dasboard</div>,
  //   children: [
  //    {
  //     path: "/dashboard",
  //     element: <div>Dasboard</div>,
  //    },
  //   ],
 },
 {
  path: "/login",
  element: <div>Login</div>,
 },
 {
  path: "/register",
  element: <div>Register</div>,
 },
]);

export default router;
