import { AnimationConfig } from "./AnimationTiles";

interface Props {
    handleChangeConfig: (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>, isNumber?: boolean) => void;
    config: AnimationConfig,
}

export default function AnimationOptions({ handleChangeConfig, config }: Props) {
    return (
        <div className="animations-options">
            <div>
                <label className="mb-2 block" htmlFor="framesX">Frames x</label>
                <input id="framesX" name="framesX" className="mb-2 w-full" type="number" placeholder="5" defaultValue={config.framesX}
                    onChange={handleChangeConfig}
                />
            </div>
            <div>
                <label className="mb-2 block" htmlFor="framesY">Frames y</label>
                <input id="framesY" name="framesY" className="w-full" type="number" placeholder="5" defaultValue={config.framesX}
                    onChange={handleChangeConfig}
                />
            </div>
            <div>
                <label className="mb-2 block" htmlFor="framesXStatic">Statis frames x</label>
                <input id="framesXStatic" name="framesXStatic" className="mb-2 w-full" type="number" placeholder="5" defaultValue={config.framesXStatic}
                    onChange={handleChangeConfig}
                />
            </div>
            <div>
                <label className="mb-2 block" htmlFor="framesYStatic">Static frames y</label>
                <input id="framesYStatic" name="framesYStatic" className="w-full" type="number" placeholder="5" defaultValue={config.framesXStatic}
                    onChange={handleChangeConfig}
                />
            </div>
            <div className="mb-2">
                <label className="mb-2 block" htmlFor="import">Import</label>
                <select
                    id="predefined"
                    name="predefined"
                    className="rounded px-4 py-3 w-full"
                    onChange={e => handleChangeConfig(e, false)}
                    defaultValue="none"
                >
                    <option value="none">None</option>
                    <option value="vertical_to_horizontal">Vertical to horizontal</option>
                </select>
            </div>
        </div>
    )
}
