import React from "react";

export const KineticTable = ({columns, data}) => {

    return (
        <div className="table-wrapper">
            <table className="table">
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
                    {data.map((rowData, key) => {
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
                <tfoot className="table-footer">

                </tfoot>
            </table>
        </div>
    )
}