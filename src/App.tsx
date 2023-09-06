import './css/normalize.css';
import './App.css';

import TilesetEditor from './tileset-editor/TilesetEditor';
import AnimationEditor from './animation-editor/AnimationEditor';
import OptionsFrame from './options-frame/OptionsFrame';

function App() {
    return (
        <div className="app">
            <TilesetEditor />
            <div className="row">
                <AnimationEditor />
                <OptionsFrame />
            </div>
        </div>
    );
}

export default App;
