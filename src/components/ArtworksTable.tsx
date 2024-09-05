import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable, DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import SelectedArtworksPanel from './SelectedArtworksPanel';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const MyDataTable: React.FC = () => {
    const [data, setData] = useState<Artwork[]>([]);
    const [selectedArtworks,  setSelectedArtworks] = useState<Artwork[]>([]);
    const [allSelectedArtworks, setAllSelectedArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const overlayPanelRef = useRef<OverlayPanel>(null);

    useEffect(() => {
        fetchData(first / rows + 1, rows);
    }, [first, rows]);

    const fetchData = useCallback((page: number, limit: number, updateSelection = false) => {
        setLoading(true);
        fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.data);
                setTotalRecords(data.pagination.total);

                if (updateSelection) {
                    const newSelection = [...allSelectedArtworks, ...data.data];
                    setSelectedArtworks(newSelection);
                    setAllSelectedArtworks(newSelection);
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [allSelectedArtworks]);

    const onPageChange: DataTableProps['onPage'] = (event:any) => {
        setFirst(event.first ?? 0);
        setRows(event.rows ?? 10);
    };
    
    const onRowsInputChange = async (e: { value: number }) => {
        const numRows = e.value;
        if (numRows && numRows > 0) {
            setRows(numRows);
            setFirst(0);
            await fetchData(1, numRows); 
        }
        if (numRows && numRows > 0) {
            const newSelection = data.slice(0, numRows);
            setData(newSelection);
        
            setSelectedArtworks(newSelection);
        }
    console.log("Enter button clicked!");
    
    };


    const onSelectionChange = (e: any) => {
        setSelectedArtworks(e.value);
        setAllSelectedArtworks(e.value);
        console.log(selectedArtworks,"selectedWorks");
        console.log(allSelectedArtworks,"allselectedWork")

    };

    return (
        <div>
            <DataTable 
                value={data} 
                paginator 
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                rows={rows} 
                totalRecords={totalRecords} 
                lazy 
                first={first} 
                loading={loading} 
                onPage={onPageChange} 
                responsiveLayout="scroll"
                selectionMode="multiple"
                selection={selectedArtworks}
                onSelectionChange={onSelectionChange}
            >
                <Column header={() => (
                    <div className="p-d-flex p-ai-center">
                        <Button type="button" icon="pi pi-chevron-down" className="p-button-text p-ml-2" onClick={(e) => overlayPanelRef.current?.toggle(e)} />
                        <OverlayPanel ref={overlayPanelRef}>
                            <h3>Select Rows</h3>
                            <InputNumber value={rows} onValueChange={(e) => onRowsInputChange(e)} placeholder="Number of rows" />
                            <Button type="button" label="Enter" onClick={(e) => onRowsInputChange(e)} />
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

export default MyDataTable;
