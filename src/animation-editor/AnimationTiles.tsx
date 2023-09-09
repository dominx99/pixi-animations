import { Fragment, useEffect, useState } from "react";
import { AnimationTile, AnimationTileset } from "./AnimationEditor";

export interface AnimationConfig {
    framesX: number,
    framesY: number
}

interface Props {
    config: AnimationConfig,
    tileset: AnimationTileset,
    selectedTile: AnimationTile | null,
    handleSelectTile: (tile: AnimationTile) => void,
}

export default function AnimationEditor(props: Props) {
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
                                className="animation-tile tile"
                            ></div>;
                        }

                        return (
                            <div
                                key={`${tile.x}-${tile.y}`}
                                className={'animation-tile tile test' + (props.selectedTile === tile ? ' tile-selected' : '')}
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
    )
}
