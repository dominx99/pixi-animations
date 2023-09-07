import EventEmitter from "events";

interface Props {
    socket: EventEmitter;
}

export default function OptionsFrame ({ socket }: Props) {
    return (
        <div className="options-frame">
            <button
                className="rounded px-4 py-3"
                onClick={() => {
                    socket.emit('tileset.export');
                }}
            >Export</button>
        </div>
    )
}
