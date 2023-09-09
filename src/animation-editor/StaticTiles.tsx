import { Fragment, useEffect } from "react";
import { SelectedTile, StaticTile, StaticTileset, TilesetType } from "./AnimationEditor";

export interface TilesetSize {
    framesX: number,
    framesY: number
}

interface Props {
    config: TilesetSize,
    tileset: StaticTileset,
    selectedTile: SelectedTile | null,
    handleSelectTile: (tile: StaticTile) => void,
    handleRemoveTile: (tile: StaticTile) => void,
}

export default function StaticEditor(props: Props) {
    useEffect(() => {
        console.log('config', props.config);
    }, [props.config]);

    return (
        <div className="animations-tileset">
            <h2 className="text-lg mb-2 text-slate-400">Static tileset</h2>
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
                                            && props.selectedTile.type === TilesetType.Static ? ' tile-selected' : ''
                                    )}
                                    onClick={() => props.handleSelectTile(tile)}
                                    onDoubleClick={() => props.handleRemoveTile(tile)}
                                    style={{
                                        backgroundImage: `url(${tile.tile?.url})`,
                                    }}
                                ></div>
                            )
                        }))}
                    </Fragment>
                }))}
            </div>
        </div>
    )
}
