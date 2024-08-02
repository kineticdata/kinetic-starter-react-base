import React, { useCallback, useContext, useMemo, useState } from "react";
import { DropdownMenu } from "./Dropdown/Dropdown";
import { LoadingSpinner } from "./LoadingSpinner";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";

// Make sure to note rowData[column.value] must have a value 
// which should be handled when parsing the incoming data. 
export const KineticQueryTable = ({columns, data }) => {
    const globalState = useContext(GlobalContext);
    const { isMobileDevice, tableQuery, setTableQuery, tablePagination, setTablePagination } = globalState;
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    const rowNumbers = [10, 25, 50, 100];
    const paginationOptions = useMemo(() => (
        rowNumbers.map(number => (
                <button 
                    aria-label={`Set number of rows shown to ${number}`}
                    className="pagination-options remove-padding" 
                    onClick={() => {setTableQuery({...tableQuery, limit: number})}}
                >
                    {number}
                </button> 
        ))
    ), [tableQuery]);

    const dropdownFace = useMemo(() => (
        <button 
            aria-label="Pagination Options"
            className="table-dropdown-face"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            <div className="table-dropdown-content">
                {tableQuery?.limit || 10}
                <i className='las la-angle-down arrow-size hover-arrow' aria-hidden='true' />
            </div>
        </button>
    ), [tableQuery]);
    
    const getSortIcon = useCallback(columnInfo => {
        if (tableQuery.search.direction === 'ASC' && columnInfo.value === tableQuery.search.orderBy) {
            return <i className="las la-sort-up sort-icon" aria-hidden="true" />
        } else if (tableQuery.search.direction === 'DESC' && columnInfo.value === tableQuery.search.orderBy) {
            return <i className="las la-sort-down sort-icon" aria-hidden="true" />
        } else {
            return <i className="las la-sort sort-icon" aria-hidden="true" />
        }
    }, [tableQuery])

    const updateSortInfo = columnInfo => {
        if(columnInfo.value === tableQuery.search.orderBy) {
            if (tableQuery.search.direction === 'ASC') {
                setTablePagination({nextPageToken: null, previousPageToken: [], pageToken: undefined})
                setTableQuery({...tableQuery, pageToken: null, search: {...tableQuery.search, direction: 'DESC'}})
            } else {
                setTablePagination({nextPageToken: null, previousPageToken: [], pageToken: undefined})
                setTableQuery({...tableQuery, pageToken: null, search: {...tableQuery.search, direction: 'ASC'}})
            }
        } else {
            setTablePagination({nextPageToken: null, previousPageToken: [], pageToken: undefined})
            setTableQuery({...tableQuery, pageToken: null, search: {...tableQuery.search, orderBy: columnInfo.value, direction: 'ASC'}})
        }
    };

    const getPaginationButton = side => {
        if (side === 'right') {
            return (
                <button 
                    aria-label="Next table page"
                    onClick={() => {
                        setTableQuery({...tableQuery, pageToken: tablePagination.nextPageToken})
                        setTablePagination({
                            ...tablePagination, 
                            pageToken: tablePagination.nextPageToken, 
                            previousPageToken: tablePagination.previousPageToken.length > 0 ? 
                                [...tablePagination.previousPageToken, tablePagination.pageToken] : 
                                [tablePagination.pageToken]
                        })
                    }}
                    disabled={tablePagination.pageToken === tablePagination.nextPageToken}
                    className={`las la-angle-right arrow-size${tablePagination.pageToken !== tablePagination.nextPageToken ? ' clickable' : ''}`} 
                />
            )
        } else {
            return (
                <button 
                    aria-label="Previous table page"
                    onClick={() => {
                        setTableQuery({...tableQuery, pageToken: tablePagination.previousPageToken[tablePagination.previousPageToken.length - 1]})
                        const previousPages = tablePagination.previousPageToken;
                        previousPages.pop();
                        setTablePagination({
                            ...tablePagination, 
                            pageToken: tablePagination.previousPageToken[tablePagination.previousPageToken - 1], 
                            previousPageToken: previousPages,
                        })
                    }}
                    disabled={!tablePagination.previousPageToken.length > 0 && 
                        tablePagination.previousPageToken[0] === undefined}
                    className={`las la-angle-left arrow-size${tablePagination.previousPageToken.length > 0 && 
                        tablePagination.previousPageToken[0] === undefined ? ' clickable' : ''}`} 
                />
            )
        }
    };

    return data ? (
        <>
            <div className={`table-wrapper${isMobileDevice ? ' isMobile' : ''}`}>
                <table className='table show-pagination'>
                    <thead className="table-header">
                        <tr className="table-header-row">
                            {columns.map((column, key) => {
                                return column.sortBy ? (
                                    <th 
                                        key={key}
                                        className="table-header-item sortable" 
                                    >
                                        <button onClick={() => updateSortInfo(column)} className="remove-padding">
                                            {column.title}
                                            {getSortIcon(column)}
                                        </button>
                                    </th>
                                    ) : (
                                        <th className="table-header-item" key={key}>
                                            {column.title}
                                        </th>
                                    )
                                })}
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {data.map((rowData, key) => {
                            return (
                                <tr key={key} className="table-row">
                                    {columns.map((column, key) => (
                                        <td className="table-row-item" key={key}>
                                            {rowData[column.value].toDisplay ?
                                                rowData[column.value].toDisplay :
                                                rowData[column.value]
                                            }
                                        </td>
                                    ))}
                                </tr>
                        )})}
                    </tbody>
                </table>
                {/* Desktop pagination controls */}
                {!isMobileDevice && (
                    <div className='pagination-wrapper'>
                        <>Rows per page</>
                        <DropdownMenu
                            isDropdownOpen={isDropdownOpen}
                            closeDropdown={() => setIsDropdownOpen(false)}
                            dropdownFace={dropdownFace}
                            dropdownContent={paginationOptions}
                            contentClassName='pagination-options-dropdown'
                        />
                        {getPaginationButton('left')}
                        {getPaginationButton('right')}
                    </div>  
                )}
            </div>
            {/* Mobile pagination controls */}
            {isMobileDevice && (
                    <div className='mobile-pagination-wrapper'>
                        {getPaginationButton('left')}
                        {getPaginationButton('right')}
                        <DropdownMenu
                            isDropdownOpen={isDropdownOpen}
                            closeDropdown={() => setIsDropdownOpen(false)}
                            dropdownFace={dropdownFace}
                            dropdownContent={paginationOptions}
                            faceStyle='mobile-pagination-options-dropdown'
                            contentClassName='mobile-pagination-dropdown'
                        />
                    </div>  
                )}
        </>
    ) : <LoadingSpinner />
}