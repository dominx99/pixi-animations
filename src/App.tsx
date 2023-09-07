import './css/normalize.css';
import './App.css';

import TilesetEditor from './tileset-editor/TilesetEditor';
import AnimationEditor from './animation-editor/AnimationEditor';
import OptionsFrame from './options-frame/OptionsFrame';
import { EventEmitter } from 'events';

function App() {
    const socket = new EventEmitter();
    return (
        <div className="app">
            <TilesetEditor socket={socket} />
            <div className="bottom-row">
                <AnimationEditor socket={socket} />
                <OptionsFrame />
            </div>
        </div>
    );
}

export default App;
