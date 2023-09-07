import { Fragment, useEffect } from "react";
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
    useEffect(() => {
        console.log('got tileset', props.tileset);
    }, [props.tileset])

    return (
        <div className="animations-editor" style={{
            gridTemplateColumns: `repeat(${props.config.framesX}, 64px)`,
            gridTemplateRows: `repeat(${props.config.framesY}, 64px)`,
        }}>
            {([...Array(props.config.framesY || 0)].map((_, y) => {
                return <Fragment key={y}>
                    {([...Array(props.config.framesX || 0)].map((_, x) => {
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
                                style={tile.tiles.length > 0 ? {
                                    backgroundImage: `url(${tile.tiles[0].path})`,
                                } : {}}
                            ></div>
                        )
                    }))}
                </Fragment>
            }))}
        </div>
    )
}
