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

    const handleExport = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/api/merge/pixi-animation-tileset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tileset: state.tileset,
                config: state.config,
            }),
        })

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'animation-tileset.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    const addTileToCurrentAnimationListener = (tiles: Tile[]) => {
        if (!state.selectedTile) {
            return;
        }

        const animationTile = state.tileset.tiles.find(tile => tile.x === state.selectedTile?.x && tile.y === state.selectedTile?.y);

        if (!animationTile) {
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
    }

    useEffect(() => {
        socket.on('animations.current.add-tiles', addTileToCurrentAnimationListener);
        socket.on('tileset.export', handleExport);

        updateAnimatedTileset();

        return () => {
            socket.off('animations.current.add-tiles', addTileToCurrentAnimationListener);
            socket.off('tileset.export', handleExport);
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

    const handleRemoveTile = (tile: Tile) => {
        if (!state.selectedTile) {
            return;
        }

        const animatedTile = state.tileset.tiles.find(t => t.x === state.selectedTile?.x && t.y === state.selectedTile?.y);

        if (!animatedTile) {
            return;
        }

        animatedTile.tiles = animatedTile.tiles.filter(t => t.x !== tile.x || t.y !== tile.y);

        setState({
            ...state,
            tileset: {
                ...state.tileset,
                tiles: [
                    ...state.tileset.tiles.filter(t => t.x !== animatedTile.x || t.y !== animatedTile.y),
                    animatedTile
                ]
            }
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
                onRemoveTile={handleRemoveTile}
            />
            <AnimationOptions
                config={state.config}
                handleChangeConfig={handleChangeConfig}
            />
        </div>
    )
}
