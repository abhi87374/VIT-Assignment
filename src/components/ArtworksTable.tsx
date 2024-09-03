import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import SelectedArtworksPanel from './SelectedArtworksPanel'; // Import the selected artworks panel

export interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const ArtworksTable: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(12);
    const overlayPanelRef = useRef<OverlayPanel>(null);

    useEffect(() => {
        fetchArtworks(page, rows);
    }, [page, rows]);

    const fetchArtworks = async (page: number, rows: number) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`);
            const data = await response.json();
            setArtworks(data.data);
            setTotalRecords(data.pagination.total);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = (event: DataTablePageEvent) => {
        const currentPage = event.page !== undefined ? event.page + 1 : 1;
        setPage(currentPage);
        setRows(event.rows);
    };

    const onSelectionChange = (e: any) => {
        setSelectedArtworks(e.value);
    };

    const onRowsInputChange = (e: any) => {
        const numRows = e.value;
        if (numRows && numRows > 0) {
            const newSelection = artworks.slice(0, numRows);
            setSelectedArtworks(newSelection);
        }
    };

    return (
        <div className="card">
            <DataTable
                value={artworks}
                paginator
                rows={rows}
                rowsPerPageOptions={[5, 10, 25, 50]}
                totalRecords={totalRecords}
                onPage={onPageChange}
                lazy
                loading={loading}
                selection={selectedArtworks}
                onSelectionChange={onSelectionChange}
                dataKey="id"
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column header={() => (
                    <div className="p-d-flex p-ai-center">
                        <Button type="button" icon="pi pi-chevron-down" className="p-button-text p-ml-2" onClick={(e) => overlayPanelRef.current?.toggle(e)} />
                        <OverlayPanel ref={overlayPanelRef}>
                            <h3>Select Rows</h3>
                            <InputNumber value={rows} onValueChange={(e) => onRowsInputChange(e)} placeholder="Number of rows" />
                        </OverlayPanel>
                    </div>
                )} />
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                <Column field="title" header="Title" style={{ width: '25%' }}></Column>
                <Column field="place_of_origin" header="Place of Origin" style={{ width: '25%' }}></Column>
                <Column field="artist_display" header="Artist" style={{ width: '25%' }}></Column>
                <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }}></Column>
                <Column field="date_start" header="Start Date" style={{ width: '12.5%' }}></Column>
                <Column field="date_end" header="End Date" style={{ width: '12.5%' }}></Column>
            </DataTable>
            <SelectedArtworksPanel selectedArtworks={selectedArtworks} />
        </div>
    );
};

export default ArtworksTable;
