import { Tile } from './../tileset-editor/TilesetEditor';

export interface AnimationTileset {
    x: number,
    y: number,
    tiles: Tile[]
}

export default function AnimationEditor() {
    const animations: AnimationTiles[] = [
        {
            x: 0,
            y: 0,
            tiles: [
                {
                    x: 0,
                    y: 0,
                    path: 'test'
                }
            ]
        }
    ];

    return (
        <div className="animation-editor">test</div>
    )
}
