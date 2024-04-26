import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DropdownMenu } from '../Widgets/Dropdown/Dropdown';
import { LoadingSpinner } from "./LoadingSpinner";
import moment from "moment";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";

// Make sure to note rowData[column.value] must have a value which should be handled when
// parsing the incoming data. Otherwise TODO add logic to handle null/undefined values here
export const KineticTable = ({columns, data, showPagination, customerFooter }) => {
    const globalState = useContext(GlobalContext);
    const { isMobileDevice } = globalState;
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const [ tablePageCount, setTablePageCount ] = useState(10);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ paginatedData, setPaginatedData ] = useState(showPagination ? undefined : data);
    const [ sortInfo, setSortInfo ] = useState({order: 'none'});

    const paginationOptions = useMemo(() => ([
        { render: <button className="pagination-options remove-padding" onClick={() => setTablePageCount(10)}>10</button> },
        { render: <button className="pagination-options remove-padding" onClick={() => setTablePageCount(25)}>25</button> },
        { render: <button className="pagination-options remove-padding" onClick={() => setTablePageCount(50)}>50</button> },
        { render: <button className="pagination-options remove-padding" onClick={() => setTablePageCount(100)}>100</button> },
    ]), []);

    // If the table is on the first page always use the actual first element
    const firstElement = useMemo(() => {
        return currentPage === 1 ? 0 : ( currentPage - 1 ) * tablePageCount ;
    }, [currentPage, tablePageCount]);

    const lastElement = useMemo(() => {
        return (firstElement + tablePageCount)
    }, [firstElement, tablePageCount]);

    const dropdownFace = useMemo(() => (
        <div className="table-dropdown-face">
            <div className="table-dropdown-content">
                {tablePageCount}
                <i className='las la-angle-down arrow-size' aria-hidden='true' />
            </div>
        </div>
    ), [tablePageCount]);

    const sortAlpha = ( first, second ) => {                    
        const compare1 = (first[sortInfo.keyName].toSort || first[sortInfo.keyName]).toLowerCase();
        const compare2 = (second[sortInfo.keyName].toSort || second[sortInfo.keyName]).toLowerCase();

        return compare1.localeCompare(compare2);
    }
    
    const getSortIcon = useCallback(columnInfo => {
        if (sortInfo.order === 'ASC' && columnInfo.value === sortInfo.keyName) {
            return <i className="las la-sort-up sort-icon" aria-hidden="true" />
        } else if (sortInfo.order === 'DESC' && columnInfo.value === sortInfo.keyName) {
            return <i className="las la-sort-down sort-icon" aria-hidden="true" />
        } else {
            return <i className="las la-sort sort-icon" aria-hidden="true" />
        }
    }, [sortInfo])

    const updateSortInfo = columnInfo => {
        if (sortInfo.order === 'none') {
            setSortInfo({
                order: 'ASC',
                type: columnInfo.sortBy,
                keyName: columnInfo.value,
            })
        } else if (sortInfo.order === 'ASC') {
            if (columnInfo.value === sortInfo.keyName) {
                setSortInfo({
                    order: 'DESC',
                    type: columnInfo.sortBy,
                    keyName: columnInfo.value,
                })
            } else {
                setSortInfo({
                    order: 'ASC',
                    type: columnInfo.sortBy,
                    keyName: columnInfo.value,
                })
            }
        } else {
            if (sortInfo.order === 'DESC' && columnInfo.value !== sortInfo.keyName) {
                setSortInfo({
                    order: 'ASC',
                    type: columnInfo.sortBy,
                    keyName: columnInfo.value,
                })
            } else {
                setSortInfo({
                    order: 'none',
                })
            }
        }
    };

    useEffect(() => {
        setCurrentPage(1)
    }, [tablePageCount]);

    useEffect(() => {
        if (sortInfo.order === 'ASC') {
            setPaginatedData([...data].sort((first,second) => (
                sortInfo.type === 'date' ?
                    moment(first[sortInfo.keyName].toSort) - moment(second[sortInfo.keyName].toSort)
                    : sortAlpha(first, second)
                )).slice(firstElement, lastElement));
        } else if (sortInfo.order === 'DESC') {
            setPaginatedData([...data].sort((first,second) => (
                sortInfo.type === 'date' ?
                    moment(first[sortInfo.keyName].toSort) - moment(second[sortInfo.keyName].toSort)
                    : sortAlpha(first, second)
                )).reverse().slice(firstElement, lastElement))
        } else {
            setPaginatedData(data.slice(firstElement, lastElement))
        }
    }, [tablePageCount, currentPage, sortInfo]);

    return paginatedData ? (
        <>
            <div className={`table-wrapper${isMobileDevice ? ' isMobile' : ''}`}>
                <table className={`table${showPagination ? ' show-pagination' : ''}`}>
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
                        {paginatedData.map((rowData, key) => {
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
                {showPagination && !isMobileDevice && (
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
                            {`${firstElement + 1} - ${lastElement <= data.length ? lastElement : data.length} of ${data.length}`}
                        </div>
                        <button 
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                            className={`las la-angle-left arrow-size${currentPage > 1 ? ' clickable' : ''}`} 
                        />
                        <button 
                            onClick={() => currentPage < (data.length / tablePageCount) && setCurrentPage(currentPage + 1)} 
                            className={`las la-angle-right arrow-size${currentPage < (data.length / tablePageCount) ? ' clickable' : ''}`} 
                        />
                    </div>  
                )}
                {customerFooter && customerFooter}
            </div>
            {isMobileDevice && (
                <div className='mobile-pagination-wrapper'>
                    <div>
                        {`${firstElement + 1} - ${lastElement <= data.length ? lastElement : data.length} of ${data.length}`}
                    </div>
                    <button 
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                        className={`las la-angle-left arrow-size${currentPage > 1 ? ' clickable' : ''}`} 
                    />
                    <button 
                        onClick={() => currentPage < (data.length / tablePageCount) && setCurrentPage(currentPage + 1)} 
                        className={`las la-angle-right arrow-size${currentPage < (data.length / tablePageCount) ? ' clickable' : ''}`} 
                    />
                    <DropdownMenu
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={() => setIsDropdownOpen(!isDropdownOpen)}
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