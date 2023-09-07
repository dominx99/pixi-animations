import { Fragment, useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import { Tile } from './../tileset-editor/TilesetEditor';
import AnimationOptions from './AnimationOptions';
import AnimationTiles, { AnimationConfig } from './AnimationTiles';
import AnimationTimeline from './AnimationTimeline';

export interface AnimationTileset {
    tiles: AnimationTile[]
}

export interface AnimationTile {
    x: number,
    y: number,
    tiles: Tile[]
}

export interface AnimationState {
    config: AnimationConfig,
    tileset: AnimationTileset,
    selectedTile: AnimationTile | null
}

interface Props {
    socket: EventEmitter;
}

export default function AnimationEditor({ socket }: Props) {
    const [state, setState] = useState<AnimationState>({
        config: {
            framesX: 5,
            framesY: 5
        },
        tileset: {
            tiles: [],
        },
        selectedTile: null
    });

    const addTileToCurrentAnimationListener = (tiles: Tile[]) => {
        if (!state.selectedTile) {
            console.log('no selected tile', state);
            return;
        }

        const animationTile = state.tileset.tiles.find(tile => tile.x === state.selectedTile?.x && tile.y === state.selectedTile?.y);

        if (!animationTile) {
            console.log('no animation tile', state);
            return;
        }

        animationTile.tiles.push(...tiles);

        setState({
            ...state,
            tileset: {
                ...state.tileset,
                tiles: [
                    ...state.tileset.tiles.filter(tile => tile.x !== animationTile.x || tile.y !== animationTile.y),
                    animationTile
                ]
            }
        });

        console.log('got tile', tiles)
    }

    useEffect(() => {
        socket.on('animations.current.add-tiles', addTileToCurrentAnimationListener);

        updateAnimatedTileset();

        return () => {
            socket.off('animations.current.add-tiles', addTileToCurrentAnimationListener);
        }
    }, [state.config, state.selectedTile]);

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

    const handleSelectTile = (tile: AnimationTile | null) => {
        setState({
            ...state,
            selectedTile: tile
        });
    }

    const updateAnimatedTileset = () => {
        const tileset: AnimationTileset = {
            tiles: []
        };

        const { framesX, framesY } = state.config;

        for (let y = 0; y < framesY; y++) {
            for (let x = 0; x < framesX; x++) {
                const tile = state.tileset.tiles.find(tile => tile.x === x && tile.y === y);

                if (tile) {
                    tileset.tiles.push(tile);
                } else {
                    tileset.tiles.push({
                        x,
                        y,
                        tiles: []
                    });
                }
            }
        }

        setState({
            ...state,
            tileset
        });
    }

    return (
        <div className="animations-layout">
            <AnimationTiles
                config={state.config}
                tileset={state.tileset}
                selectedTile={state.selectedTile}
                handleSelectTile={handleSelectTile}
            />
            <AnimationTimeline
                tile={state.selectedTile}
            />
            <AnimationOptions
                config={state.config}
                handleChangeConfig={handleChangeConfig}
            />
        </div>
    )
}
