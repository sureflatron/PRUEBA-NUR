import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import UserView from "./pages/Users";
import UserEdit, { userLoader } from "./pages/UserEdit";
import SignIn from "./pages/SignIn.js";
import ErrorPage from "./pages/ErrorPage"; // Nuevo componente

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
     // Página de inicio
    errorElement: <ErrorPage />, // Manejo de errores
  },/*
  {
    path: "/users",
    element: <Users />, // Lista de usuarios
    errorElement: <ErrorPage />, // Manejo de errores
  },*/
  {
    path: "/users/:userId",
    element: <UserEdit />, // Editar un usuario específico
    loader: userLoader, // Cargar datos del usuario antes de renderizar
    errorElement: <ErrorPage />, // Manejo de errores
  },

  {
    path: "/usersView/:userId",
    element: <UserView />, // Editar un usuario específico
    loader: userLoader, // Cargar datos del usuario antes de renderizar
    errorElement: <ErrorPage />, // Manejo de errores
  },
  {
    path: "/login",
    element: <SignIn />, // Página de inicio de sesión
    errorElement: <ErrorPage />, // Manejo de errores
  },
]);

export default router;