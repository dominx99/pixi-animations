import { Fragment, useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import { Position, Tile } from './../tileset-editor/TilesetEditor';
import AnimationOptions from './AnimationOptions';
import AnimationTiles, { AnimationConfig } from './AnimationTiles';
import AnimationTimeline from './AnimationTimeline';
import StaticTiles from './StaticTiles';

export interface AnimationTileset {
    tiles: AnimationTile[]
}

export interface AnimationTile {
    x: number,
    y: number,
    tiles: Tile[]
}

export interface StaticTile {
    x: number,
    y: number,
    tile: Tile | null
}

export interface StaticTileset {
    tiles: StaticTile[]
}

export enum TilesetType {
    Animation = 'animation',
    Static = 'static'
}

export interface SelectedTile extends Position {
    type: TilesetType
}

export interface AnimationState {
    config: AnimationConfig,
    tileset: AnimationTileset,
    staticTileset: StaticTileset,
    selectedTile: SelectedTile | null
}

interface Props {
    socket: EventEmitter;
}

export default function AnimationEditor({ socket }: Props) {
    const [state, setState] = useState<AnimationState>({
        config: {
            framesX: 5,
            framesY: 5,
            framesXStatic: 5,
            framesYStatic: 1,
        },
        tileset: {
            tiles: [],
        },
        staticTileset: {
            tiles: []
        },
        selectedTile: null
    });

    const handleExport = async () => {
        const id = window.location.pathname.replace('/', '');

        if (id.length !== 36) {
            return;
        }

        const response = await fetch(process.env.REACT_APP_API_URL + '/api/tileset/merge/' + id, {
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

        if (state.selectedTile.type === TilesetType.Animation) {
            addTileToCurrentAnimation(tiles);
        }

        if (state.selectedTile.type === TilesetType.Static) {
            addTileToStaticTile(tiles);
        }
    }

    const addTileToStaticTile = (tiles: Tile[]) => {
        const staticTile = state.staticTileset.tiles.find(tile => tile.x === state.selectedTile?.x && tile.y === state.selectedTile?.y);

        if (!staticTile) {
            return;
        }

        staticTile.tile = tiles[0];

        setState({
            ...state,
            staticTileset: {
                ...state.staticTileset,
                tiles: [
                    ...state.staticTileset.tiles.filter(tile => tile.x !== staticTile.x || tile.y !== staticTile.y),
                    staticTile
                ]
            }
        });
    }

    const addTileToCurrentAnimation = (tiles: Tile[]) => {
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

        const tileset = updateAnimatedTileset();
        const staticTileset = updateStaticTileset();

        setState({
            ...state,
            tileset,
            staticTileset
        });

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

    const handleSelectTile = (tile: AnimationTile | StaticTile | null) => {
        console.log('handleSelectTile', tile);
        if (!tile) {
            return;
        }

        setState({
            ...state,
            selectedTile: {
                x: tile.x || 0,
                y: tile.y || 0,
                type: tile?.hasOwnProperty('tile') ? TilesetType.Static : TilesetType.Animation
            }
        });
    }

    const updateStaticTileset = (): StaticTileset => {
        const staticTileset: StaticTileset = {
            tiles: []
        };

        const { framesXStatic, framesYStatic } = state.config;

        for (let y = 0; y < framesYStatic; y++) {
            for (let x = 0; x < framesXStatic; x++) {
                const tile = state.staticTileset.tiles.find(tile => tile.x === x && tile.y === y);

                if (tile) {
                    staticTileset.tiles.push(tile);
                } else {
                    staticTileset.tiles.push({
                        x,
                        y,
                        tile: null
                    });
                }
            }
        }

        return staticTileset;
    }

    const updateAnimatedTileset = (): AnimationTileset => {
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

        return tileset;
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

    const handleRemoveStaticTile = (tileToRemove: StaticTile) => {
        if (!state.selectedTile) {
            return;
        }

        const tile = state.staticTileset.tiles.find(t => t.x === tileToRemove.x && t.y === tileToRemove.y);

        if (!tile) {
            return;
        }

        tile.tile = null;

        setState({
            ...state,
            staticTileset: {
                ...state.staticTileset,
                tiles: [
                    ...state.staticTileset.tiles.filter(t => t.x !== tile.x || t.y !== tile.y),
                    tile
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
                tile={(state.tileset.tiles.find(tile => tile.x === state.selectedTile?.x && tile.y === state.selectedTile?.y) || null)}
                onRemoveTile={handleRemoveTile}
            />
            <StaticTiles
                config={{
                    framesX: state.config.framesXStatic,
                    framesY: state.config.framesYStatic,
                }}
                tileset={state.staticTileset}
                selectedTile={state.selectedTile}
                handleSelectTile={handleSelectTile}
                handleRemoveTile={handleRemoveStaticTile}
            />
            <AnimationOptions
                config={state.config}
                handleChangeConfig={handleChangeConfig}
            />
        </div>
    )
}
