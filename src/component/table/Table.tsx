'use client'

import { AgGridReact } from "ag-grid-react"
import { ColDef, ModuleRegistry, ClientSideRowModelModule, RowSelectionModule, PaginationModule, TextEditorModule, DateEditorModule, LargeTextEditorModule, SelectEditorModule, ValidationModule, RowApiModule, ClientSideRowModelApiModule, UndoRedoEditModule, DateFilterModule, TextFilterModule, ColumnAutoSizeModule, CellEvent, RowValueChangedEvent, CellValueChangedEvent, RowStyleModule, RowClassParams, RowDataUpdatedEvent, ModelUpdatedEvent, CustomEditorModule, ColumnApiModule } from "ag-grid-community"
import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import { TableTheme01 } from "./TableTheme";
import ContextMenu, { ContextMenuItem, useContextMenu } from "../gnb/ContextMenu";
import Label from "../lnb/Label";
import { format } from "date-fns";
import { isEqual } from "lodash";
import CustomSelectCellEditor from "./CustomSelectCellEditor";
import CustomDateCellEditor from "./CustomDateCellEditor";
import CustomLongTextCellEditor from "./CustomLongTextCellEditor";
import CustomPostCellEditor from "./CustomPostCellEditor";
import CustomTextCellEditor from "./customTextCellEditor";
import CustomImageCellEditor from "./CustomImageCellEditor";
import CustomNumberCellEditor from "./customNumberCellEditor";

ModuleRegistry.registerModules([
    ClientSideRowModelModule, 
    RowSelectionModule, 
    PaginationModule,
    TextEditorModule,
    DateEditorModule,
    LargeTextEditorModule,
    SelectEditorModule,
    ValidationModule,
    RowApiModule,
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    UndoRedoEditModule,
    DateFilterModule,
    TextFilterModule,
    ColumnAutoSizeModule,
    RowStyleModule,
    CustomEditorModule,
    ColumnApiModule,
]);

export type TableRow<T> = T & {
    _id: string | number;
    _status: 'default' | 'create' | 'update' | 'delete';
};

export interface TableCol extends ColDef {
    required?: boolean;
    tooltip?: string;
}

const Table = forwardRef<AgGridReact, {
    keyColumn: string;
    label?: string
    data: TableRow<any>[],
    setData: React.Dispatch<React.SetStateAction<TableRow<any>[]>>,
    originalData?: any[],
    colDefs: TableCol[],
    animateRows?: boolean,
    pagination?: boolean,
    paginationPageSize?: number,
    rowSelection?: {mode?: 'singleRow' | 'multiRow'; checkboxes?: true};
    onCellValueChanged?: (params: any) => void;
    onRowSelected?: (params: any) => void;
    editable?: boolean;
    disableDeleteButton?: boolean;
    disableSaveButton?: boolean;
    disableAddButton?: boolean;
    height?: 'normal' | 'autoHeight';
    className?: string;
    contextMenu?: ContextMenuItem[];
    onCellClicked?: (params: any) => void;
    children?: React.ReactNode;
    deletable?: boolean;
}>(({
    keyColumn,
    data = [],
    setData,
    originalData,
    colDefs = [],
    animateRows = true,
    pagination = true,
    paginationPageSize = 50,
    rowSelection = {mode: 'multiRow'},
    onCellValueChanged,
    onRowSelected,
    label,
    editable = true,    
    className = '',
    contextMenu =[],
    onCellClicked,
    children,
    deletable = true,
}, ref) => {

    const tableRef = useRef<AgGridReact>(null);
    useImperativeHandle(ref, () => tableRef.current as AgGridReact);

    const [contextMenuConfig, setContextMenuConfig] = useContextMenu(contextMenu);  
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const defaultContextMenu: ContextMenuItem[] = [
            {
                label: '모두 선택',
                onClick: () => {tableRef.current?.api.selectAll()},
                hide: rowSelection.mode === 'singleRow'
            },
            {
                label: '선택 해제',
                onClick: () => {tableRef.current?.api.deselectAll()}
            },
            '-',
            {
                label: '되돌리기',
                onClick: () => {
                    tableRef.current?.api.undoCellEditing();
                    // undo 후 rowData를 React 상태와 동기화
                    const newData: TableRow<any>[] = [];
                    tableRef.current?.api.forEachNode((node: any) => {
                        newData.push(node.data);
                    });
                    setData(newData);
                },
                hide: true
            },
            {
                label: '초기화',
                onClick: () => {
                    if (!originalData || originalData.length === 0) return;
                    setData(originalData.map(d => ({
                        ...d,
                        _status: 'default',
                        _id: d[keyColumn as keyof typeof d]
                    })) as unknown as TableRow<any>[]);
                },
                hide: !originalData || originalData.length === 0
            },
            '-',
            {
                label: '선택 삭제',
                className: 'active:bg-redTone hover:bg-redTone',
                onClick: () => {
                    const selected = tableRef.current?.api.getSelectedRows();
                    if(selected){
                        setData(prev => prev.map(d => {
                            if(selected.includes(d)){
                                return {...d, _status: 'delete'}
                            }
                            return d
                        }))
                    };
                    tableRef.current?.api.deselectAll();
                },
                hide: !deletable
            }
        ]
        const filteredMenus = defaultContextMenu.filter(dm => {
            if(dm === '-') return true;
            return !contextMenu.some(menu => typeof menu !== 'string' && menu.label === dm.label);
        })
        const newContextMenu: ContextMenuItem[] = [
            ...contextMenu,
            ...(contextMenu.length > 0 ? [{label: '-'}] : []),
            ...filteredMenus
        ];

        if(JSON.stringify(newContextMenu) !== JSON.stringify(contextMenuConfig.menus) ) {
            setContextMenuConfig((prev) => ({
                ...prev,
                menus: newContextMenu
            }));
        }
    }, [contextMenu, contextMenuConfig.menus, isMounted, originalData, keyColumn, deletable, rowSelection.mode])
    

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: false,
        resizable: true,
        minWidth: 64,
        editable: true,
        type: 'text',
        stopEditingWhenCellsLoseFocus: true,
        // autoSize: true,
    }), []);

    const rowSelectionConfig = useMemo(() => ({
        mode: rowSelection.mode || 'multiRow',
        checkboxes: rowSelection.checkboxes ?? true,
        headerCheckbox: true,
    }), [rowSelection]);

    const onGridReady = (params: any) => {
        // params.api.sizeColumnsToFit();
    };

    const resort = (colId: string) => {
        // 현재 컬럼의 정렬 순서
        const currentColumn  = tableRef.current?.api.getColumn(colId);
        const currentSort = currentColumn?.getSort();
        const newSort = currentSort === 'asc' ? 'desc' : 'asc';
        const newState = [
            {
                colId: colId,
                sort: newSort
            }
        ]
        tableRef.current?.api.applyColumnState({
            state: [
                {
                    colId: colId,
                    sort: newSort
                }
            ]
        })
    }

    const colDefsData = useMemo(() => {
        return colDefs?.map((colDef) => ({
            ...colDef,
            width: colDef.type === 'id' ? 48 : undefined,
            type: colDef.type || 'text',
            editable: !editable ? false : colDef.editable !== undefined ? colDef.editable : true,
            valueParser: cellValueParser(colDef),
            valueFormatter: cellValueFormatter(colDef),
            cellEditor: CustomCellEditor(colDef),
            cellEditorPopup: CustomCellEditorPopup(colDef),
            cellEditorParams: CustomCellEditorParams(colDef),
            cellEditorPopupPosition: 'over' as const,
            filter: !colDef.filter ? false : colDef.filter || 'agTextColumnFilter',
            headerClass: colDef.required ? 'required' : ''
        }));
    }, [colDefs, editable]);

    const handleContextMenu = (event: any) => {
         setContextMenuConfig((prev) => ({
            ...prev,
            position: {x: event.event.clientX, y: event.event.clientY},
            isOpen: true
        }))
    }

    const handleValueChange = (event: CellValueChangedEvent) => {
        let newStatus: 'default' | 'create' | 'update' | 'delete' = 'default'
        const findMatched = originalData?.find(row => row[keyColumn] === event.data[keyColumn]);
        // data에는 없으면 새로운 데이터
        if(findMatched){
            const {_id, _status, ...rest} = event.data
            // 값을 JSON으로 변환해서 비교
            const originalJson = JSON.stringify(findMatched);
            const newJson = JSON.stringify(rest);
            if(!isEqual(originalJson, newJson)){
                newStatus = 'update'
            }
        } else {
            newStatus = 'create'
        }
        setData(prev => prev.map(d => {
            if(d[keyColumn] === event.data[keyColumn]){
                return {...d, _status: newStatus}
            }
            return d
        }))
        onCellValueChanged && onCellValueChanged(event)
    }

    const getRowStyle = (params: any) => {
        const status = params.data._status;
        switch (status) {
            case 'create':
                return { background: '#dafde4' }; // 연한 초록색
            case 'update':
                return { background: '#eaf0ff' }; // 연한 주황색
            case 'delete':
                return { background: '#ffe9e9' }; // 연한 빨간색
            default:
                return { background: 'white' };
        }
    };


    if(!isMounted) return ;

    return (
        <div className="w-full h-full flex flex-col">
            {
                (label || children ) && <>
                    <div className="grid grid-cols-[auto_1fr] items-center mb-1 px-2">
                        {
                            label &&
                            <Label className="col-start-1">{label}</Label>
                        }
                        {
                            children && 
                            <div className="flex items-center gap-2 col-start-2 justify-end">
                                {children}
                            </div>
                        }
                    </div>
                </>
            }
            <div className={`min-h-[160px] flex-1 h-full w-full ag-grid-container border rounded-xl overflow-hidden border-black-200 ${className}`}>
                <AgGridReact
                    ref={tableRef}
                    rowData={data}
                    getRowId={(params) => {
                        return params.data[keyColumn].toString();  // 문자열로 변환
                    }}
                    columnDefs={colDefsData}
                    defaultColDef={defaultColDef}
                    animateRows={animateRows}
                    pagination={false}
                    paginationPageSize={paginationPageSize}
                    theme={TableTheme01}
                    rowSelection={rowSelectionConfig}
                    onGridReady={onGridReady}
                    getRowStyle={getRowStyle}
                    suppressScrollOnNewData={true}
                    ensureDomOrder={true}
                    domLayout={"normal"}
                    onCellValueChanged={handleValueChange}
                    enableCellTextSelection={true}
                    undoRedoCellEditing={true}
                    undoRedoCellEditingLimit={20}
                    onCellContextMenu={handleContextMenu}
                    preventDefaultOnContextMenu={true}
                    onRowSelected={onRowSelected}
                    singleClickEdit={true}
                    onCellClicked={onCellClicked}
                    stopEditingWhenCellsLoseFocus={true}
                />
                {
                    contextMenuConfig.menus.length > 0 &&
                    <ContextMenu value={contextMenuConfig} setValue={setContextMenuConfig}/>
                }
            </div>
        </div>
    )
})

Table.displayName = 'Table'

export default Table

const cellValueParser = (colDef: ColDef) => {
    switch (colDef.type) {
        case 'date':
            return (value: any) => {
                console.log(value)
                return value ? new Date(value) : null
            }
        case 'number':
            return (value: any) => value === '' || value === null ? null : Number(value)
        default:
            return undefined
    }
}

const cellValueFormatter = (colDef: ColDef) => {
    switch (colDef.type) {
        case 'date':
            return (params: { value: any }) => params.value ? format(new Date(params.value), 'yyyy-MM-dd') : ''
        default:
            return undefined
    }
}


const CustomCellEditor = (colDef: ColDef) => {
    switch (colDef.type) {
        case 'select': 
            return CustomSelectCellEditor
        case 'longText':
            return CustomLongTextCellEditor
        case 'date':
                return CustomDateCellEditor
        case 'post':
            return CustomPostCellEditor
        case 'image':
            return CustomImageCellEditor
        case 'number':
            return CustomNumberCellEditor
        default:
            return CustomTextCellEditor
    }
}

const CustomCellEditorPopup = (colDef: ColDef) => {
    switch (colDef.type) {
        case 'longText':
            return true;
        case 'date':
            return false;
        case 'post':
            return true;
        case 'image':
            return true;

        case 'number':
            return false;
        default:
            return false
    }
}

const CustomCellEditorParams = (colDef: ColDef) => {
    switch (colDef.type) {
        case 'select' : {
            return {
                options: colDef.cellEditorParams?.options || []
            }
        }
        default:
            return {}
    }
}


export function useTableData<T extends { [key: string]: any }>(refData: T[], keyColumn: string){
    const [data, setData] = useState<TableRow<T>[]>([]);

    useEffect(() => {
        const newData = refData.map(d => ({
            ...d,
            _status: d._status || 'default',
            _id: d[keyColumn as keyof T] as string | number
        })) as unknown as TableRow<T>[];

        // 값이 진짜로 바뀔 때만 setData 실행
        if (!isEqual(data, newData)) {
            setData(newData);
        }
    }, [refData, keyColumn]) // data 의존성 제거

    return [data, setData] as [TableRow<T>[], React.Dispatch<React.SetStateAction<TableRow<T>[]>>];
}