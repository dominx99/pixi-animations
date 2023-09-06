import './css/normalize.css';
import './App.css';

import { useEffect, useState } from 'react';

interface Tile {
    path: string;
    x: number;
    y: number;
}

interface Metadata {
    tiles: Tile[];
    framesX: number;
    framesY: number;
    tileWidth: number;
    tileHeight: number;
}

function App() {
    const [state, setState] = useState({
        metadata: {} as Metadata,
    });

    useEffect(() => {
        const fetchTilesAsync = async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/cut-tileset');
            const metadata = await response.json() as Metadata;

            console.log(metadata);

            setState({
                metadata: metadata,
            });
        };

        fetchTilesAsync();
    }, []);

    if (!state.metadata.framesX || !state.metadata.framesY) {
        return null;
    }

    return (
        <div className="tileset">
            {([...Array(state.metadata.framesY)].map((_, y) => {
                return <>
                    {([...Array(state.metadata.framesX)].map((_, x) => {
                        const tile = state.metadata.tiles.find(tile => tile.x === x && tile.y === y);

                        if (!tile) {
                            return null;
                        }

                        return (
                            <div
                                key={`${tile.x}-${tile.y}`}
                                className="tile"
                                style={{ backgroundImage: `url(${tile.path})` }}
                            ></div>
                        )
                    }))}
                </>
            }))}
        </div>
    );
}

export default App;
