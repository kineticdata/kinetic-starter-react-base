import React, { useEffect, useMemo, useState } from "react";
import { DropdownMenu } from '../Widgets/Dropdown/Dropdown';
import { LoadingSpinner } from "./LoadingSpinner";

export const KineticTable = ({columns, data, showPagination}) => {
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const [ tablePageCount, setTablePageCount ] = useState(10);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ paginatedData, setPaginatedData ] = useState(showPagination ? undefined : data);

    const dropdownFace = useMemo(() => (
            <div className="table-dropdown-face">
                <div className="table-dropdown-content">
                    {tablePageCount}
                    <i className='fa fa-angle-down arrow-size' aria-hidden='true' />
                </div>
            </div>
        ), [tablePageCount])

    useEffect(() => {
        setCurrentPage(1)
    }, [tablePageCount])

    const paginationOptions = useMemo(() => ([
        { render: <div className="pagination-options" onClick={() => setTablePageCount(10)}>10</div> },
        { render: <div className="pagination-options" onClick={() => setTablePageCount(25)}>25</div> },
        { render: <div className="pagination-options" onClick={() => setTablePageCount(50)}>50</div> },
        { render: <div className="pagination-options" onClick={() => setTablePageCount(100)}>100</div> },
    ]), [])

    // If the table is on the first page always use the actual first element
    const firstElement = useMemo(() => {
        return currentPage === 1 ? 0 : ( currentPage - 1 ) * tablePageCount ;
    }, [currentPage, tablePageCount]);

    const lastElement = useMemo(() => {
        return (firstElement + tablePageCount)
    }, [firstElement, tablePageCount])

    useEffect(() => {
        setPaginatedData(data.slice(firstElement, lastElement))
    }, [tablePageCount, currentPage])

    return paginatedData ? (
        <div className="table-wrapper">
            <table className={`table${showPagination ? ' show-pagination' : ''}`}>
                <thead className="table-header">
                    <tr className="table-header-row">
                        {columns.map((column, key) => {
                            return (
                                <th className="table-header-item" key={key}>
                                    {column.title}
                                </th>
                                )
                            })}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {paginatedData.map((rowData, key) => {
                        return (
                            <tr key={key} className="table-row">
                                {columns.map((column, key) => (
                                    <td className="table-row-item" key={key}>
                                        {rowData[column.value]}
                                    </td>
                                ))}
                            </tr>
                    )})}
                </tbody>
            </table>
            {showPagination && (
                <div className='pagination-wrapper'>
                    <>Rows per page</>
                    <DropdownMenu
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={() => setIsDropdownOpen(!isDropdownOpen)}
                        dropdownFace={dropdownFace}
                        dropdownContent={paginationOptions}
                        contentClassName='pagination-options-dropdown'
                    />
                    <div>
                        {`${firstElement + 1} - ${lastElement} of ${data.length}`}
                    </div>
                    <div 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                        className={`fa fa-angle-left arrow-size${currentPage > 1 ? ' clickable' : ''}`} 
                    />
                    <div 
                        onClick={() => currentPage < (data.length / tablePageCount) && setCurrentPage(currentPage + 1)} 
                        className={`fa fa-angle-right arrow-size${currentPage < (data.length / tablePageCount) ? ' clickable' : ''}`} 
                    />
                </div>  
            )}
        </div>
    ) : <LoadingSpinner />
}