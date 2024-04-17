import React from 'react';
import { useTable } from 'react-table';

const LogsTable = ({ logs }) => {
    // Definición de las columnas de la tabla
    const columns = React.useMemo(
        () => [
            {
                Header: 'Level',
                accessor: 'level', // el valor que elige qué campo de los datos usar para esta columna
            },
            {
                Header: 'Message',
                accessor: 'message',
            },
            {
                Header: 'Sender ID',
                accessor: 'idSender',
            },
            {
                Header: 'Topic',
                accessor: 'topic',
            },
            {
                Header: 'Timestamp',
                accessor: 'timestamp',
                Cell: ({ value }) => {
                    // Formatear la fecha
                    return new Date(value).toLocaleString();
                }
            }
        ],
        []
    );

    // Uso del hook useTable para pasar la configuración de datos y columnas
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: logs });

    // Renderizado de la tabla
    return (
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} style={{ borderBottom: 'solid 3px red', background: 'aliceblue', color: 'black', fontWeight: 'bold' }}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()} style={{ padding: '10px', border: 'solid 1px gray' }}>
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default LogsTable;
