import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';

const usePreviousLocation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousLocationRef = useRef<string | null>(null);

    useEffect(() => {
        // Update the previous location before changing to the new one
        return () => {
            previousLocationRef.current = location.pathname;
        };
    }, [location]);

    const navigateBack = () => {
        if (previousLocationRef.current) {
            navigate(previousLocationRef.current);
        } else {
            navigate('/'); // Default fallback route
        }
    };

    return { navigateBack };
};

export default usePreviousLocation;
