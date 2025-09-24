import { useTable } from 'react-table';
import styled from "@emotion/styled";

export default function Table({ columns, data, onRowClick }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <TableWrapper>
      <StyledTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, colIdx) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  style={{
                    padding: '12px 8px',
                    borderBottom: '1px solid #ddd',
                    backgroundColor: '#f9f9f9',
                    textAlign: 'left',
                    borderTopLeftRadius: colIdx === 0 ? '12px' : 0,
                    borderTopRightRadius: colIdx === headerGroup.headers.length - 1 ? '12px' : 0
                  }}
                >
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
              <tr {...row.getRowProps()} key={row.id} onClick={() => onRowClick(row.original)}>
                {row.cells.map((cell, colIdx) => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;
