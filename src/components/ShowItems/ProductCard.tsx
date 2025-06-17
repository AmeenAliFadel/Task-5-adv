import { Link } from 'react-router-dom';
import defaultImage from '../../assets/image.png';

// Define the props interface for the ProductCard component
interface ProductCardProps {
    id: string;                      // Product ID
    name: string;                    // Product name
    image_url: string;               // URL of the product image
    onDelete: (id: string) => void;  // Function to handle product deletion
}

// ProductCard component displays a product with edit and delete options
export default function ProductCard({ id, name, image_url, onDelete }: ProductCardProps) {
    return (
        <div className="item-card rounded">
            {/* Product Image */}
            <img
                className="rounded w-100 h-100"
                src={image_url}
                alt={name}
                
                // Fallback to default image if loading fails
                onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                }}
            />

            {/* Overlay appears on hover with product actions */}
            <div className="overlay w-100 h-100 d-flex align-items-center justify-content-center flex-column">
                
                {/* Link to view product details */}
                <Link className='btn' to={`/route/products/showitem/${id}`}>
                    <h5>{name}</h5>
                </Link>

                {/* Edit and Delete buttons */}
                <div className="buttons d-flex align-items-center justify-content-center gap-2">
                    
                    {/* Link to edit product */}
                    <Link
                        className="btn edit-btn btn-warning text-white rounded"
                        to={`/route/products/edititem/${id}`}
                    >
                        Edit
                    </Link>

                    {/* Delete product */}
                    <button
                        className="btn delete-btn rounded"
                        onClick={() => onDelete(id)}
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
}
