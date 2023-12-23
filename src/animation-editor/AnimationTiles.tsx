import { Fragment, useEffect, useState } from "react";
import { AnimationTile, AnimationTileset, SelectedTile, TilesetType } from "./AnimationEditor";

export interface AnimationConfig {
    framesX: number,
    framesY: number
    framesXStatic: number,
    framesYStatic: number,
    predefined: string,
}

interface Props {
    config: AnimationConfig,
    tileset: AnimationTileset,
    selectedTile: SelectedTile | null,
    handleSelectTile: (tile: AnimationTile) => void,
}

export default function AnimationTiles(props: Props) {
    const [current, setCurrent] = useState<number>(0);
    const [lastTileIndex, setLastTileIndex] = useState<number>(0);

    useEffect(() => {
        let max = 0;

        props.tileset.tiles.forEach(tile => {
            if (tile.tiles.length > (max + 1)) {
                max = tile.tiles.length - 1;
            }
        });

        setLastTileIndex(max);
    }, [props.tileset]);

    useEffect(() => {
        setTimeout(() => {
            setCurrent(current + 1 > lastTileIndex ? 0 : current + 1);
        }, 1000 / 5);
    }, [lastTileIndex, current])

    return (
        <div className="animations-tileset">
            <h2 className="mb-2 text-lg text-slate-400">Animated tileset</h2>
            <div className="animations-editor" style={{
                gridTemplateColumns: `repeat(${props.config.framesX}, 64px)`,
                gridTemplateRows: `repeat(${props.config.framesY}, 64px)`,
            }}>
                {([...Array(props.config.framesY > 0 ? props.config.framesY : 0)].map((_, y) => {
                    return <Fragment key={y}>
                        {([...Array(props.config.framesX > 0 ? props.config.framesX : 0)].map((_, x) => {
                            const tile = props.tileset.tiles.find(tile => tile.x === x && tile.y === y);

                            if (!tile) {
                                return <div
                                    key={`${x}-${y}`}
                                    className="animation-tile tile test"
                                ></div>;
                            }

                            return (
                                <div
                                    key={`${tile.x}-${tile.y}`}
                                    className={'animation-tile tile' + (
                                        props.selectedTile?.x === tile.x
                                            && props.selectedTile?.y === tile.y
                                            && props.selectedTile.type === TilesetType.Animation ? ' tile-selected' : ''
                                    )}
                                    onClick={() => props.handleSelectTile(tile)}
                                    style={tile.tiles.length > 0 && tile.tiles[current] ? {
                                        backgroundImage: `url(${tile.tiles[current].url})`,
                                    } : {}}
                                ></div>
                            )
                        }))}
                    </Fragment>
                }))}
            </div>
        </div>
    )
}
