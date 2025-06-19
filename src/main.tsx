import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login/Login.tsx';
import SignUp from './components/SignUp/SignUp.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from './pages/Products/Products.tsx';
import Favorites from './pages/Favorites/Favorites.tsx';
import OrderList from './pages/OrderList/OrderList.tsx';
import ShowItems from './components/ShowItems/ShowItems.tsx';
import AddItem from './components/AddItem/AddItem.tsx';
import EditItem from './components/EditItem/EditItem.tsx';
import ShowItem from './components/ShowItem/ShowItem.tsx';
import Dashboard from './Dashboard.tsx';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "route",
    element: <Dashboard />,
    children: [
      {
        path: "products",
        element: <Products />,
        children: [
          {
            path: "showitems",
            element: <ShowItems />
          },
          {
            path: "additem",
            element: <AddItem />
          },
          {
            path: "edititem/:id",
            element: <EditItem />
          },
          {
            path: "showitem/:id",
            element: <ShowItem />
          }
        ]
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "orderlist",
        element: <OrderList />,
      },
    ],
  },
],
  {
    basename: "/Task-5-adv",  
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes}   />
  </StrictMode>,
)
