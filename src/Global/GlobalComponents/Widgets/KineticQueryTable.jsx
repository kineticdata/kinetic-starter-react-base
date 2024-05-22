import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DropdownMenu } from "./Dropdown/Dropdown";
import { LoadingSpinner } from "./LoadingSpinner";
import moment from "moment";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";

// Make sure to note rowData[column.value] must have a value 
// which should be handled when parsing the incoming data. 
export const KineticQueryTable = ({columns, data, defaultQuery, customerFooter }) => {
    const globalState = useContext(GlobalContext);
    const { isMobileDevice, tableQuery, setTableQuery } = globalState;
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const [ tablePageCount, setTablePageCount ] = useState(tableQuery?.limit || 10);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ paginatedData, setPaginatedData ] = useState();
    const [ sortInfo, setSortInfo ] = useState({order: 'none'});

    useEffect(() => {
        if(!tableQuery){
            setTableQuery(defaultQuery)
        }
    }, [])

    const paginationOptions = useMemo(() => ([
        { render: 
            <button 
                aria-label='Set number of rows shown to 10' 
                className="pagination-options remove-padding" 
                onClick={() => {setTableQuery({...tableQuery, limit: 10})}}
            >
                10
            </button> 
        },
        { render: 
            <button 
                aria-label='Set number of rows shown to 25' 
                className="pagination-options remove-padding" 
                onClick={() => {setTableQuery({...tableQuery, limit: 25})}}
            >
                25
            </button> 
        },
        { render: 
            <button 
                aria-label='Set number of rows shown to 50' 
                className="pagination-options remove-padding" 
                onClick={() => {setTableQuery({...tableQuery, limit: 50})}}
            >
                50
            </button> 
        },
        { render: 
            <button 
                aria-label='Set number of rows shown to 100' 
                className="pagination-options remove-padding" 
                onClick={() => {setTableQuery({...tableQuery, limit: 100})}}
            >
                100
            </button> 
        },
    ]), [tableQuery]);

    // If the table is on the first page always use the actual first element
    // const firstElement = useMemo(() => {
    //     return currentPage === 1 ? 0 : ( currentPage - 1 ) * tablePageCount;
    // }, [currentPage, tablePageCount]);

    // const lastElement = useMemo(() => {
    //     return (firstElement + tablePageCount)
    // }, [firstElement, tablePageCount]);

    const dropdownFace = useMemo(() => (
        <button 
            aria-label="Pagination Options"
            className="table-dropdown-face"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            <div className="table-dropdown-content">
                {tableQuery?.limit || 10}
                <i className='las la-angle-down arrow-size' aria-hidden='true' />
            </div>
        </button>
    ), [tableQuery]);

    // const sortAlpha = ( first, second ) => {                    
    //     const compare1 = (first[sortInfo.keyName].toSort || first[sortInfo.keyName]).toLowerCase();
    //     const compare2 = (second[sortInfo.keyName].toSort || second[sortInfo.keyName]).toLowerCase();

    //     return compare1.localeCompare(compare2);
    // }
    
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
        console.log('HIT', columnInfo)
        if(columnInfo.value === tableQuery.search.orderBy) {
            if (tableQuery.search.direction === 'ASC') {
                setTableQuery({...tableQuery, search: {...tableQuery.search, direction: 'DESC'}})
            } else {
                setTableQuery({...tableQuery, search: {...tableQuery.search, direction: 'ASC'}})
            }
        } else {
            setTableQuery({...tableQuery, search: {...tableQuery.search, orderBy: columnInfo.value, direction: 'ASC'}})
        }

        // if (sortInfo.order === 'none') {
        //     setSortInfo({
        //         order: 'ASC',
        //         type: columnInfo.sortBy,
        //         keyName: columnInfo.value,
        //     })
        // } else if (sortInfo.order === 'ASC') {
        //     if (columnInfo.value === sortInfo.keyName) {
        //         setSortInfo({
        //             order: 'DESC',
        //             type: columnInfo.sortBy,
        //             keyName: columnInfo.value,
        //         })
        //     } else {
        //         setSortInfo({
        //             order: 'ASC',
        //             type: columnInfo.sortBy,
        //             keyName: columnInfo.value,
        //         })
        //     }
        // } else {
        //     if (sortInfo.order === 'DESC' && columnInfo.value !== sortInfo.keyName) {
        //         setSortInfo({
        //             order: 'ASC',
        //             type: columnInfo.sortBy,
        //             keyName: columnInfo.value,
        //         })
        //     } else {
        //         setSortInfo({
        //             order: 'none',
        //         })
        //     }
        // }
    };

    // useEffect(() => {
    //     setCurrentPage(1)
    // }, [tablePageCount]);

    // useEffect(() => {
    //     if (sortInfo.order === 'ASC') {
    //         setPaginatedData([...data].sort((first,second) => (
    //             sortInfo.type === 'date' ?
    //                 moment(first[sortInfo.keyName].toSort) - moment(second[sortInfo.keyName].toSort)
    //                 : sortAlpha(first, second)
    //             )).slice(firstElement, lastElement));
    //     } else if (sortInfo.order === 'DESC') {
    //         setPaginatedData([...data].sort((first,second) => (
    //             sortInfo.type === 'date' ?
    //                 moment(first[sortInfo.keyName].toSort) - moment(second[sortInfo.keyName].toSort)
    //                 : sortAlpha(first, second)
    //             )).reverse().slice(firstElement, lastElement))
    //     } else {
    //         setPaginatedData(data.slice(firstElement, lastElement))
    //     }
    // }, [tablePageCount, currentPage, sortInfo]);

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
                {!isMobileDevice ? (
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
                            data count
                            {/* {`${firstElement + 1} - ${lastElement <= data.length ? lastElement : data.length} of ${data.length}`} */}
                        </div>
                        Arrow Buttons
                        {/* <button 
                        aria-label="Previous table page"
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                            className={`las la-angle-left arrow-size${currentPage > 1 ? ' clickable' : ''}`} 
                        />
                        <button 
                        aria-label="Next table page"
                            onClick={() => currentPage < (data.length / tablePageCount) && setCurrentPage(currentPage + 1)} 
                            className={`las la-angle-right arrow-size${currentPage < (data.length / tablePageCount) ? ' clickable' : ''}`} 
                        /> */}
                    </div>  
                ) : 
                (
                    <div className='mobile-pagination-wrapper'>
                        <div>
                            data count
                            {/* {`${firstElement + 1} - ${lastElement <= data.length ? lastElement : data.length} of ${data.length}`} */}
                        </div>
                        <div className='mobile-pagination-arrows'>
                            Arrow buttons
                            {/* <button 
                            aria-label="Previous table page"
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                                className={`las la-angle-left arrow-size${currentPage > 1 ? ' clickable' : ''}`} 
                            />
                            <button 
                            aria-label="Next table page"
                                onClick={() => currentPage < (data.length / tablePageCount) && setCurrentPage(currentPage + 1)} 
                                className={`las la-angle-right arrow-size${currentPage < (data.length / tablePageCount) ? ' clickable' : ''}`} 
                            /> */}
                        </div>
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
                {customerFooter && customerFooter}
            </div>
        </>
    ) : <LoadingSpinner />
}