import { AnimationConfig } from "./AnimationTiles";

interface Props {
    handleChangeConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
    config: AnimationConfig,
}

export default function AnimationOptions({ handleChangeConfig, config }: Props) {
    return (
        <div className="animations-options">
            <div>
                <label className="mb-2 block" htmlFor="anim-x">Frames x</label>
                <input id="anim-x" name="framesX" className="mb-2 w-full" type="number" placeholder="5" defaultValue={config.framesX}
                    onChange={handleChangeConfig}
                />
            </div>
            <div>
                <label className="mb-2 block" htmlFor="anim-y">Frames y</label>
                <input id="anim-y" name="framesY" className="w-full" type="number" placeholder="5" defaultValue={config.framesX}
                    onChange={handleChangeConfig}
                />
            </div>
        </div>
    )
}
