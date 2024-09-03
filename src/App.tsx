import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import ArtworksTable from './components/ArtworksTable.tsx';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Artworks</h1>
            <ArtworksTable />
        </div>
    );
};

export default App;
