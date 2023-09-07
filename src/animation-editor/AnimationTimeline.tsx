import { AnimationTile } from "./AnimationEditor";

interface Props {
    tile: AnimationTile | null
}

export default function AnimationTimeline({ tile }: Props) {
    return (
        <div className="animations-timeline">
            {(tile?.tiles || []).map((tile, i) => (
                <div className="tile animation-tile flex flex-col" key={i} style={{
                    backgroundImage: `url(${tile.path})`,
                }}></div>
            ))}
        </div>
    )
}
