import { Fragment, useState } from 'react';
import { Tile } from './../tileset-editor/TilesetEditor';

export interface AnimationTileset {
    tiles: AnimationTile[]
}

export interface AnimationTile {
    x: number,
    y: number,
    tiles: Tile[]
}

export interface AnimationState {
    config: {
        framesX: number,
        framesY: number
    },
    tileset: AnimationTileset,
}

export default function AnimationEditor() {
    const [state, setState] = useState<AnimationState>({
        config: {
            framesX: 5,
            framesY: 5
        },
        tileset: {
            tiles: [],
        }
    });

    const handleChangeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setState({
            ...state,
            config: {
                ...state.config,
                [name]: parseInt(value)
            }
        });
    }

    return (
        <div className="animations-layout">
            <div className="animations-editor" style={{
                gridTemplateColumns: `repeat(${state.config.framesX}, 64px)`,
                gridTemplateRows: `repeat(${state.config.framesY}, 64px)`,
            }}>
                {([...Array(state.config.framesY || 0)].map((_, y) => {
                    return <Fragment key={y}>
                        {([...Array(state.config.framesX || 0)].map((_, x) => {
                            const tile = state.tileset.tiles.find(tile => tile.x === x && tile.y === y);

                            if (!tile) {
                                return <div className="animation-tile tile"></div>;
                            }

                            return (
                                <div
                                    key={`${tile.x}-${tile.y}`}
                                    className="tile"
                                    style={{ backgroundImage: `url(${tile.tiles[0].path})` }}
                                ></div>
                            )
                        }))}
                    </Fragment>
                }))}
            </div>
            <div className="animations-config">
                <div>
                    <label className="mb-2 block" htmlFor="anim-x">Frames x</label>
                    <input id="anim-x" name="framesX" className="mb-2 w-full" type="number" placeholder="5" defaultValue={state.config.framesX}
                        onChange={handleChangeConfig}
                    />
                </div>
                <div>
                    <label className="mb-2 block" htmlFor="anim-y">Frames y</label>
                    <input id="anim-y" name="framesY" className="w-full" type="number" placeholder="5" defaultValue={state.config.framesX}
                        onChange={handleChangeConfig}
                    />
                </div>
            </div>
        </div>
    )
}
