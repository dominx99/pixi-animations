import { Tile } from "../tileset-editor/TilesetEditor";
import { AnimationTile } from "./AnimationEditor";

interface Props {
    tile: AnimationTile | null,
    onRemoveTile: (tile: Tile) => void
}

export default function AnimationTimeline({ tile, onRemoveTile }: Props) {
    return (
        <div className="animations-timeline">
            {(tile?.tiles || []).map((tile, i) => (
                <div
                    className="tile animation-tile flex flex-col" key={i}
                    style={{
                        backgroundImage: `url(${tile.url})`,
                    }}
                    onClick={() => onRemoveTile(tile)}
                ></div>
            ))}
        </div>
    )
}
