import { CreateRoomButton } from "../components/createRoom"
import { JoinRoomButton } from "../components/joinRoom"
import { Title } from "../components/Title"

export const HomePage = () => {
    return(
        <>
            <Title />
            <CreateRoomButton />
            <JoinRoomButton />
        </>
    )
}