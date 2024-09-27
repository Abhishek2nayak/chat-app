import { Link } from "react-router-dom";

const HomeScreen = () => {
    return (
        <>
            <div className="w-full h-full flex justify-center items-center gap-3">
                <Link to={'../join-room'} className="btn btn-primary">
                    Join Room
                </Link>
                <Link to={'../add-new-room'} className="btn btn-secondary">
                    Add New Room
                </Link>
            </div>
        </>
    )
}

export default HomeScreen;