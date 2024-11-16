import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import Cell from './cells/Cell';
import Header from './header/Header';
import PlusIcon from './img/Plus';
import { ActionTypes } from './utils';
import { FixedSizeList } from 'react-window';
import scrollbarWidth from './scrollbarWidth';

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 520,
  Cell: Cell,
  Header: Header,
  sortType: 'alphanumericFalsyLast',
};

export default function Table({
  columns,
  data,
  dispatch: dataDispatch,
  skipReset,
}) {
  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  const [selectedRowData, setSelectedRowData] = useState([]);
  const [checkedRows, setCheckedRows] = useState(new Set());

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch,
      autoResetSortBy: !skipReset,
      autoResetFilters: !skipReset,
      autoResetRowState: !skipReset,
      sortTypes,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);

      const isChecked = checkedRows.has(row.id);

      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className={`tr ${isChecked ? 'selected' : ''}`}
        >
          <div
            style={{
              padding: '10px',
              border: '0.5px solid #e7e7e7',
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleRowSelect(row)}
            />
          </div>
          {row.cells.map(cell => (
            <div {...cell.getCellProps()} className="td">
              {cell.render('Cell')}
            </div>
          ))}
        </div>
      );
    },
    [prepareRow, rows, checkedRows]
  );

  const handleRowSelect = row => {
    const newCheckedRows = new Set(checkedRows);

    if (newCheckedRows.has(row.id)) {
      newCheckedRows.delete(row.id); // Uncheck the row
    } else {
      newCheckedRows.add(row.id); // Check the row
    }

    setCheckedRows(newCheckedRows);

    // Update selectedRowData based on the updated checked rows
    const updatedSelectedRows = rows
      .filter(row => newCheckedRows.has(row.id))
      .map(row => row.original);

    setSelectedRowData(updatedSelectedRows);

    console.log('Selected row data:', updatedSelectedRows);
  };

  const handleSelectAll = () => {
    if (checkedRows.size === rows.length) {
      setCheckedRows(new Set());
      setSelectedRowData([]);
    } else {
      const allRowIds = new Set(rows.map(row => row.id));
      setCheckedRows(allRowIds);
      setSelectedRowData(rows.map(row => row.original));
    }

    console.log('All selected row data:', selectedRowData);
  };

  // Log or use `selectedRowData` as needed
  useEffect(() => {
    if (selectedRowData.length > 0) {
      console.log('Currently selected rows:', selectedRowData);
    }
  }, [selectedRowData]);

  return (
    <div style={{ width: '100vw', overflow: 'auto' }}>
      {/* <pre className="">{JSON.stringify(columns, null, 2)} </pre> */}
      <div {...getTableProps()} className={clsx('table')}>
        <div>
          {/* <div style={{ marginRight: "25px" }}> */}
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  border: '0.5px solid #e7e7e7',
                  padding: '10px',
                }}
              >
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={checkedRows.size === rows.length}
                />
              </div>
              {headerGroup.headers.map(column => column.render('Header'))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          <FixedSizeList
            height={rows.length * 40}
            itemCount={rows.length}
            itemSize={40}
            width={totalColumnsWidth + scrollbarWidth}
          >
            {RenderRow}
          </FixedSizeList>
          <div
            className="tr add-row"
            onClick={() => dataDispatch({ type: ActionTypes.ADD_ROW })}
          >
            <span className="svg-icon svg-gray icon-margin">
              <PlusIcon />
            </span>
            New
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useMemo, useState } from 'react';
// import clsx from 'clsx';
// import {
//   useTable,
//   useBlockLayout,
//   useResizeColumns,
//   useSortBy,
// } from 'react-table';
// import Cell from './cells/Cell';
// import Header from './header/Header';
// import PlusIcon from './img/Plus';
// import { ActionTypes } from './utils';
// import { FixedSizeList } from 'react-window';
// import scrollbarWidth from './scrollbarWidth';

// const defaultColumn = {
//   minWidth: 50,
//   width: 150,
//   maxWidth: 400,
//   Cell: Cell,
//   Header: Header,
//   sortType: 'alphanumericFalsyLast',
// };

// export default function Table({
//   columns,
//   data,
//   dispatch: dataDispatch,
//   skipReset,
// }) {
//   const sortTypes = useMemo(
//     () => ({
//       alphanumericFalsyLast(rowA, rowB, columnId, desc) {
//         if (!rowA.values[columnId] && !rowB.values[columnId]) {
//           return 0;
//         }

//         if (!rowA.values[columnId]) {
//           return desc ? -1 : 1;
//         }

//         if (!rowB.values[columnId]) {
//           return desc ? 1 : -1;
//         }

//         return isNaN(rowA.values[columnId])
//           ? rowA.values[columnId].localeCompare(rowB.values[columnId])
//           : rowA.values[columnId] - rowB.values[columnId];
//       },
//     }),
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     totalColumnsWidth,
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn,
//       dataDispatch,
//       autoResetSortBy: !skipReset,
//       autoResetFilters: !skipReset,
//       autoResetRowState: !skipReset,
//       sortTypes,
//     },
//     useBlockLayout,
//     useResizeColumns,
//     useSortBy
//   );

//   const [selectedRowData, setSelectedRowData] = useState(null);
//   const [checked, setChecked] = useState(null);

//   const RenderRow = React.useCallback(
//     ({ index, style }) => {
//       const row = rows[index];
//       prepareRow(row);

//       return (
//         <div
//           {...row.getRowProps({
//             // onClick: () => setSelectedRowData(row.original),
//             style,
//           })}
//           className={`tr ${selectedRowData === row.original ? 'selected' : ''}`} // Optionally add a selected style
//         >
//           <input  // `row.original` contains the raw data for that row
//             onClick={() => {
//               setSelectedRowData(row.original);

//               setChecked(!checked)
//             }}
//             type='checkbox'
//             checked={checked}

//           />
//           {
//             row.cells.map(cell => (
//               <div {...cell.getCellProps()} className="td">
//                 {cell.render('Cell')}
//               </div>
//             ))
//           }
//         </div >
//       );
//     },
//     [prepareRow, rows, selectedRowData]
//   );

//   // Log or use `selectedRowData` as needed, it will hold the data of the clicked row
//   useEffect(() => {
//     if (selectedRowData) {
//       console.log('Selected row data:', selectedRowData);
//       // You can trigger any action or API call with the selected row data here
//     }
//   }, [selectedRowData]);

//   function isTableResizing() {
//     for (let headerGroup of headerGroups) {
//       for (let column of headerGroup.headers) {
//         if (column.isResizing) {
//           return true;
//         }
//       }
//     }

//     return false;
//   }

//   return (
//     <div style={{ maxWidth: '100vw', overflow: 'auto' }}>
//       <div
//         {...getTableProps()}
//         className={clsx('table', isTableResizing() && 'noselect')}
//       >
//         <div>
//           {headerGroups.map(headerGroup => (
//             <div {...headerGroup.getHeaderGroupProps()} className="tr">
//               {headerGroup.headers.map(column => column.render('Header'))}
//             </div>
//           ))}
//         </div>
//         <div {...getTableBodyProps()}>
//           <FixedSizeList
//             height={480}
//             itemCount={rows.length}
//             itemSize={40}
//             width={totalColumnsWidth + scrollbarWidth}
//           >
//             {RenderRow}
//           </FixedSizeList>
//           <div
//             className="tr add-row"
//             onClick={() => dataDispatch({ type: ActionTypes.ADD_ROW })}
//           >
//             <span className="svg-icon svg-gray icon-margin">
//               <PlusIcon />
//             </span>
//             New
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
