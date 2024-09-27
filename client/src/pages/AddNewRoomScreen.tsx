import { FormEvent, useState } from "react";
import useUnsplashImages, { Photo } from "../hooks/useUnsplashImages";
import useDebounce from "../hooks/useDebounce";
import Alert from "../components/Alert";
import { createNewRoom } from "../api/roomService";
import { useNavigate } from "react-router-dom";

const AddNewRoomScreen = () => {
    const [roomName, setRoomName] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const debounceQuery = useDebounce(query, 500);
    const { images, loading, error } = useUnsplashImages({ query: debounceQuery });

    const navigate = useNavigate();
    if (error) {
        Alert({
            message: error,
            type: "error",
        });
    }

    const handleAddNewRoom = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!roomName || !selectedImage) {
            // Alert({
            //     message: "Please provide both room name and select an image.",
            //     type: "info",
            // });
            return;
        }

        const payload = { name: roomName, avatar: selectedImage };

        try {
            const response = await createNewRoom(payload);
            if (response) {
                // Optionally show success alert
                // Alert({
                //     message: "Room created successfully!",
                //     type: "success",
                // });

                // Reset form
                setQuery("");
                setRoomName("");
                setSelectedImage(null);
            }
        } catch (error) {
            console.error("Error occurred while creating room:", error);
            // Optionally show error alert
            // Alert({
            //     message: "Room creation failed.",
            //     type: "error",
            // });
        }
    };

    return (
        <section className="w-full h-full flex justify-center">
            <form className="w-[500px]" onSubmit={handleAddNewRoom}>
                <h1 className="text-3xl text-center my-8">Add New Room</h1>

                <label className="input mt-5 input-bordered flex items-center gap-2">
                    Room Name
                    <input
                        type="text"
                        className="grow"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                </label>

                <label className="input mt-5 input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>

                <div className="my-5 h-[100px] room-images-container w-full flex justify-center gap-5 items-center">
                    {loading ? (
                        <span className="loading loading-spinner loading-lg"></span>
                    ) : images.length === 0 ? (
                        <span>No Images found</span>
                    ) : (
                        images.map((image: Photo) => (
                            <div
                                key={image.urls.small}
                                className={`avatar cursor-pointer ${selectedImage === image.urls.small
                                    ? "ring-success ring-offset-base-200 w-24 ring ring-offset-2"
                                    : ""
                                    }`}
                                onClick={() => setSelectedImage(image.urls.small)}
                            >
                                <div className="w-24 rounded">
                                    <img src={image.urls.small} alt="Image preview" />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    type="submit"
                    className="mt-5 btn btn-primary w-full"
                >
                    Add Room
                </button>
                <button
                    type="button"
                    className="btn mt-5"
                    onClick={() => navigate('/room')}
                >
                    Back To Chat Room
                </button>
            </form>
        </section>
    );
};

export default AddNewRoomScreen;
