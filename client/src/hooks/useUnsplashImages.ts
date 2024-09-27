import { useEffect, useState } from 'react';
import unsplash from '../api/unsplashService';


export type Photo = {
    id: string;
    alt_description: string | null;
    urls: {
        small: string;
        regular: string;
        full: string;
    };
    user: {
        name: string;
        username: string;
    };
};

type UseUnsplashImagesProps = {
    query: string;
};

const useUnsplashImages = ({ query }: UseUnsplashImagesProps) => {
    const [images, setImages] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await unsplash.search.getPhotos({
                query,
                page: 1,
                perPage: 4,
            });

            if (response.response) {
                setImages(response.response.results);
                setError(null);
            }
        } catch (error) {
            setError('Failed to fetch the images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(query)
        if (query) {
            fetchImages();
        }
    }, [query]);

    return { images, loading, error };
};

export default useUnsplashImages;
