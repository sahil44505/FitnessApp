import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import './css/BadgeIcon.css'; 
import { useShopContext } from '../context/ShopContext';

const BadgeIcon = ({ icon }) => {
    const { total_item } = useShopContext();

    return (
        <div className="badge-container">
            <i 
                className={`fa-duotone fa-solid fa-cart-shopping fa badge ${icon}`}
                style={{ 
                    'color': 'white', 
                    
                }}
            />
            {total_item && parseInt(total_item, 10) > 0 && (
                <span className="badge-count">{total_item}</span>
            )}
        </div>
    );
};

export default BadgeIcon;
