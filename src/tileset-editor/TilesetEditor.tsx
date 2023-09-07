import React from 'react';
import { useEffect, useState } from 'react';
import { EventEmitter } from 'events';

export interface Tile {
    path: string;
    x: number;
    y: number;
}

export interface Position {
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

interface Props {
    socket: EventEmitter;
}

interface State {
    metadata: Metadata;
    draw: {
        startPosition: Position | null;
        endPosition: Position | null;
    }
}

export default function TilesetEditor({ socket }: Props) {
    const [state, setState] = useState<State>({
        metadata: {} as Metadata,
        draw: {
            startPosition: null,
            endPosition: null,
        }
    });

    useEffect(() => {
        const fetchTilesAsync = async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/cut-tileset');
            const metadata = await response.json() as Metadata;

            console.log(metadata);

            setState({
                ...state,
                metadata: metadata,
            });
        };

        fetchTilesAsync();
    }, []);

    useEffect(() => {
        addTilesToCurrentAnimationFromDraw();
    }, [state.draw])

    const handleAddTilesToCurrentAnimation = (tiles: Tile[]) => {
        socket.emit('animations.current.add-tiles', tiles);
    }

    const handleSelectPoint = ({ x, y }: { x: number, y: number }) => {
        if (!state.draw.startPosition) {
            setState({
                ...state,
                draw: {
                    ...state.draw,
                    startPosition: {
                        x: x,
                        y: y,
                    }
                }
            });

            return;
        }

        if (!state.draw.endPosition) {
            setState({
                ...state,
                draw: {
                    ...state.draw,
                    endPosition: {
                        x: x,
                        y: y,
                    }
                }
            });

            return;
        }
    }

    const addTilesToCurrentAnimationFromDraw = () => {
        console.log(state);
        if (!state.draw.startPosition || !state.draw.endPosition) {
            console.log('no start or end position');

            return;
        }

        const tiles: Tile[] = [];

        for (let x = state.draw.startPosition.x; x <= state.draw.endPosition.x; x++) {
            for (let y = state.draw.startPosition.y; y <= state.draw.endPosition.y; y++) {
                const tile = state.metadata.tiles.find(tile => tile.x === x && tile.y === y);

                if (!tile) {
                    continue;
                }

                tiles.push(tile);
            }
        }

        console.log('add', tiles);

        handleAddTilesToCurrentAnimation(tiles);

        setState({
            ...state,
            draw: {
                startPosition: null,
                endPosition: null,
            }
        });
    }

    if (!state.metadata.framesX || !state.metadata.framesY) {
        return <div className="tileset"></div>
    }

    return (
        <div className="tileset-editor">
            {([...Array(state.metadata.framesY)].map((_, y) => {
                return <React.Fragment key={y}>
                    {([...Array(state.metadata.framesX)].map((_, x) => {
                        const tile = state.metadata.tiles.find(tile => tile.x === x && tile.y === y);

                        if (!tile) {
                            return null;
                        }

                        return (
                            <div
                                key={`${tile.x}-${tile.y}`}
                                className={'tile' + (state.draw.startPosition
                                    && state.draw.startPosition.x === tile.x
                                    && state.draw.startPosition.y === tile.y
                                    ? ' tile-selected-start' : ''
                                )}
                                style={{ backgroundImage: `url(${tile.path})` }}
                                onClick={() => handleSelectPoint({ ...tile })}
                            ></div>
                        )
                    }))}
                </React.Fragment>
            }))}
        </div>
    )
}
