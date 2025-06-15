import { Outlet, useLocation } from 'react-router-dom';
import './Products.css';
import ShowItems from '../../components/ShowItems/ShowItems';

export default function Products() {
    const location = useLocation();

    // Check if the current path is exactly /route/products
    const isProductsRoot = location.pathname === '/route/products';

    return (
        <>
            <div>
                {isProductsRoot ? <ShowItems /> : <Outlet />}
            </div>
        </>
    );
}
