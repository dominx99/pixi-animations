import { AnimationTile } from "./AnimationEditor";

interface Props {
    tile: AnimationTile | null,
    onRemoveTile: (tile: AnimationTile) => void
}

export default function AnimationTimeline({ tile, onRemoveTile }: Props) {
    return (
        <div className="animations-timeline">
            {(tile?.tiles || []).map((tile, i) => (
                <div
                    className="tile animation-tile flex flex-col" key={i}
                    style={{
                        backgroundImage: `url(${tile.path})`,
                    }}
                    onClick={() => onRemoveTile(tile)}
                ></div>
            ))}
        </div>
    )
}
