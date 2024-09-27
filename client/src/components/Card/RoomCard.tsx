import moment from "moment";
import { RoomState } from "../../pages/types"

export type RoomCardProps =
    Pick<RoomState, "avatar" | "createdTime" | "id" | "name">
    & {
        joined: boolean,
        onSelected: (id: string) => void
    }

const RoomCard = ({ id, avatar, name, joined, onSelected, createdTime }: RoomCardProps) => {
    const creationDate = moment(createdTime).format("D MMMM YYYY");
    return (
        <div
            className="card bg-base-100 image-full  shadow-xl"
            style={{ maxHeight: "250px" }}
            id={id}

        >
            <figure>
                <img
                    style={{ objectFit: 'cover' }}
                    src={avatar}
                    alt={name}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p className="card-normal">
                    {creationDate}
                </p>
                <div className="card-actions justify-end">
                    <button
                        className="btn btn-warning"
                        onClick={() => onSelected(id)}
                        disabled={joined}
                    >
                        {joined ? "Joined" : "Join"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RoomCard;