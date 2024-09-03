import React from 'react';
import { Artwork } from './ArtworksTable';

interface SelectedArtworksPanelProps {
    selectedArtworks: Artwork[];
}

const SelectedArtworksPanel: React.FC<SelectedArtworksPanelProps> = ({ selectedArtworks }) => {
    return (
        <div className="selected-artworks-panel">
            <h3>Selected Artworks</h3>
            <ul>
                {selectedArtworks.map((artwork) => (
                    <li key={artwork.id}>{artwork.title} - {artwork.artist_display}</li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedArtworksPanel;
