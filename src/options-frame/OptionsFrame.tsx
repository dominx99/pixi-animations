import EventEmitter, { on } from "events";
import { useState } from "react";

interface Props {
    socket: EventEmitter;
}

interface State {
    config: {
        tileWidth: number;
        tileHeight: number;
    }
}

export default function OptionsFrame({ socket }: Props) {
    const [state, setState] = useState<State>({
        config: {
            tileWidth: 32,
            tileHeight: 32,
        }
    });

    const handleChangeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const { config } = state;
        /** @ts-ignore */
        config[name] = parseInt(value);
        setState({ ...state, config });
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!files || files?.length <= 0) {
            return;
        }

        const file = files[0];

        let data = new FormData();
        data.append('tileset', file);
        data.append('tileWidth', state.config.tileWidth.toString());
        data.append('tileHeight', state.config.tileHeight.toString());

        const response = await fetch(process.env.REACT_APP_API_URL + '/api/cut-tileset', {
            method: 'POST',
            body: data,
        })

        const json = await response.json();

        window.location.href = '/' + json.id;
    }

    return (
        <div className="options-frame">
            <div>
                <label className="mb-2 block" htmlFor="tileWidth">Tile width</label>
                <input id="tileWidth" name="tileWidth" className="mb-2 w-full" type="number" placeholder="5" defaultValue={state.config.tileWidth}
                    onChange={handleChangeConfig}
                />
            </div>
            <div className="mb-2">
                <label className="mb-2 block" htmlFor="tileHeight">Tile height</label>
                <input id="tileHeight" name="tileHeight" className="w-full" type="number" placeholder="5" defaultValue={state.config.tileHeight}
                    onChange={handleChangeConfig}
                />
            </div>
            <div className="mb-2">
                <label className="mb-2 block" htmlFor="import">Import</label>
                <input
                    type="file"
                    id="import"
                    className="rounded px-4 py-3 w-full"
                    onChange={handleFileChange}
                />
            </div>
            <button
                className="rounded px-4 py-3"
                onClick={() => {
                    socket.emit('tileset.export');
                }}
            >Export</button>
        </div>
    )
}
