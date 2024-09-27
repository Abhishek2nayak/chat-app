import { createApi } from "unsplash-js";


const unsplash_api_secret_key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const unsplash = createApi({
    accessKey :unsplash_api_secret_key,
});

export default unsplash;