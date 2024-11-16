// import React, { useState } from 'react';
// import { useTable, useRowSelect, useResizeColumns } from 'react-table'; // import useResizeColumns
// import Select from 'react-select';
// import { v4 as uuidv4 } from 'uuid';

// const DataTable = () => {
//     const [columns, setColumns] = useState([
//         { Header: 'ID', accessor: 'id', type: 'number', isEditable: false },
//         { Header: 'Name', accessor: 'name', type: 'text', isEditable: true },
//         { Header: 'Email', accessor: 'email', type: 'email', isEditable: true },
//         { Header: 'Tags', accessor: 'tags', type: 'multiselect', isEditable: true },
//         { Header: 'Active', accessor: 'active', type: 'checkbox', isEditable: true }
//     ]);

//     const [data, setData] = useState([
//         { id: 1, name: 'John Doe', email: 'john@example.com', tags: ['Frontend'], active: true },
//         { id: 2, name: 'Jane Smith', email: 'jane@example.com', tags: ['Backend'], active: false }
//     ]);

//     const handleCellChange = (rowIndex, columnId, value) => {
//         setData(oldData => {
//             const newData = [...oldData];
//             newData[rowIndex][columnId] = value;
//             return newData;
//         });
//     };

//     const handleAddColumn = (type) => {
//         const newColumnId = uuidv4();
//         setColumns([...columns, { Header: `New Column`, accessor: newColumnId, type, isEditable: true }]);
//         setData(oldData => oldData.map(row => ({ ...row, [newColumnId]: '' })));
//     };

//     const handleDeleteColumn = (columnId) => {
//         setColumns(columns.filter(col => col.accessor !== columnId));
//         setData(data.map(row => {
//             const { [columnId]: _, ...rest } = row;
//             return rest;
//         }));
//     };

//     const renderEditableCell = (cell) => {
//         const { column, row, value } = cell;
//         const rowIndex = row.index;
//         const columnId = column.id;

//         switch (column.type) {
//             case 'checkbox':
//                 return (
//                     <input
//                         type="checkbox"
//                         checked={value || false}
//                         onChange={(e) => handleCellChange(rowIndex, columnId, e.target.checked)}
//                     />
//                 );
//             case 'email':
//                 return (
//                     <input
//                         type="email"
//                         value={value}
//                         onChange={(e) => handleCellChange(rowIndex, columnId, e.target.value)}
//                     />
//                 );
//             case 'number':
//                 return (
//                     <input
//                         type="number"
//                         value={value}
//                         onChange={(e) => handleCellChange(rowIndex, columnId, Number(e.target.value))}
//                     />
//                 );
//             case 'multiselect':
//                 return (
//                     <Select
//                         isMulti
//                         options={[
//                             { value: 'Frontend', label: 'Frontend' },
//                             { value: 'Backend', label: 'Backend' },
//                             { value: 'Design', label: 'Design' }
//                         ]}
//                         value={(Array.isArray(value) ? value : []).map(tag => ({ value: tag, label: tag }))}
//                         onChange={(selectedOptions) => handleCellChange(rowIndex, columnId, selectedOptions.map(opt => opt.value))}
//                     />
//                 );

//             default:
//                 return (
//                     <input
//                         type="text"
//                         value={value || ''}
//                         onChange={(e) => handleCellChange(rowIndex, columnId, e.target.value)}
//                     />
//                 );
//         }
//     };

//     const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
//         columns,
//         data,
//         defaultColumn: { Cell: renderEditableCell },
//     }, useResizeColumns, useRowSelect); // apply useResizeColumns plugin here

//     return (
//         <div>
//             <button onClick={() => handleAddColumn('text')}>Add Text Column</button>
//             <button onClick={() => handleAddColumn('number')}>Add Number Column</button>
//             <button onClick={() => handleAddColumn('email')}>Add Email Column</button>
//             <button onClick={() => handleAddColumn('multiselect')}>Add Multi-select Column</button>
//             <button onClick={() => handleAddColumn('checkbox')}>Add Checkbox Column</button>
//             <table {...getTableProps()} style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
//                 <thead>
//                     {headerGroups.map(headerGroup => (
//                         <tr {...headerGroup.getHeaderGroupProps()}>
//                             {headerGroup.headers.map(column => (
//                                 <th
//                                     {...column.getHeaderProps(column.getResizerProps())} // add resizer props to each column header
//                                     style={{ border: '1px solid black', padding: 8, cursor: 'pointer', position: 'relative' }}
//                                     contentEditable={column.isEditable}
//                                     suppressContentEditableWarning={true}
//                                     onBlur={(e) => {
//                                         const newHeader = e.target.innerText;
//                                         setColumns(columns.map(col =>
//                                             col.accessor === column.id ? { ...col, Header: newHeader } : col
//                                         ));
//                                     }}
//                                 >
//                                     {column.render('Header')}
//                                     <div
//                                         {...column.getResizerProps()}
//                                         style={{
//                                             display: 'inline-block',
//                                             width: '5px',
//                                             height: '100%',
//                                             backgroundColor: 'gray',
//                                             position: 'absolute',
//                                             right: 0,
//                                             top: 0,
//                                             cursor: 'col-resize',
//                                             zIndex: 1
//                                         }}
//                                     />
//                                     <button onClick={() => handleDeleteColumn(column.id)} style={{ marginLeft: 8 }}>Delete</button>
//                                 </th>
//                             ))}
//                         </tr>
//                     ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                     {rows.map(row => {
//                         prepareRow(row);
//                         return (
//                             <tr {...row.getRowProps()}>
//                                 {row.cells.map(cell => (
//                                     <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: 8 }}>
//                                         {cell.render('Cell')}
//                                     </td>
//                                 ))}
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DataTable;

import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DataTable = () => {
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'ID', field: 'id', editable: false, type: 'number' },
    { headerName: 'Name', field: 'name', editable: true, type: 'text' },
    {
      headerName: 'Email',
      field: 'email',
      editable: true,
      cellRenderer: EmailRenderer,
      type: 'email',
    },
    {
      headerName: 'Tags',
      field: 'tags',
      editable: true,
      type: 'multiselect',
      cellEditor: TagsEditor,
    },
    {
      headerName: 'Active',
      field: 'active',
      editable: true,
      type: 'checkbox',
      cellRenderer: CheckboxRenderer,
      cellEditor: CheckboxEditor,
    },
  ]);

  const [rowData, setRowData] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      tags: ['Frontend'],
      active: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      tags: ['Backend'],
      active: false,
    },
  ]);

  // Renderer and Editor for Email
  function EmailRenderer({ value }) {
    return <a href={`mailto:${value}`}>{value}</a>;
  }

  // Renderer and Editor for Checkbox
  function CheckboxRenderer({ value }) {
    return <input type="checkbox" checked={!!value} readOnly />;
  }
  function CheckboxEditor({ value, api, column, rowIndex }) {
    const handleChange = e => {
      api
        .getDisplayedRowAtIndex(rowIndex)
        .setDataValue(column.colId, e.target.checked);
    };
    return (
      <input type="checkbox" defaultChecked={!!value} onChange={handleChange} />
    );
  }

  // Tags (Multi-select) Editor for setting tags array
  function TagsEditor({ value, api, column, rowIndex }) {
    const [selectedTags, setSelectedTags] = useState(value || []);
    const handleTagChange = e => {
      const tags = e.target.value.split(',').map(tag => tag.trim());
      setSelectedTags(tags);
      api.getDisplayedRowAtIndex(rowIndex).setDataValue(column.colId, tags);
    };
    return (
      <input
        type="text"
        defaultValue={selectedTags.join(', ')}
        onChange={handleTagChange}
        placeholder="Add tags separated by commas"
      />
    );
  }

  // Adding a new column with custom type
  const addNewColumn = type => {
    const newField = `newColumn${columnDefs.length}`;
    const newColumn = {
      headerName: `Column ${columnDefs.length}`,
      field: newField,
      editable: true,
      type,
      ...(type === 'multiselect' && { cellEditor: TagsEditor }),
      ...(type === 'checkbox' && {
        cellRenderer: CheckboxRenderer,
        cellEditor: CheckboxEditor,
      }),
      ...(type === 'email' && { cellRenderer: EmailRenderer }),
    };
    setColumnDefs([...columnDefs, newColumn]);
  };

  // Changing Column Header (Renaming)
  const renameColumn = (field, newHeader) => {
    const updatedColumns = columnDefs.map(col =>
      col.field === field ? { ...col, headerName: newHeader } : col
    );
    setColumnDefs(updatedColumns);
  };

  // Changing Column Type
  const changeColumnType = (field, newType) => {
    const updatedColumns = columnDefs.map(col => {
      if (col.field === field) {
        return {
          ...col,
          type: newType,
          editable: true,
          ...(newType === 'multiselect' && { cellEditor: TagsEditor }),
          ...(newType === 'checkbox' && {
            cellRenderer: CheckboxRenderer,
            cellEditor: CheckboxEditor,
          }),
          ...(newType === 'email' && { cellRenderer: EmailRenderer }),
        };
      }
      return col;
    });
    setColumnDefs(updatedColumns);
  };

  // Validate cell content based on type
  const onCellValueChanged = params => {
    const { colDef, newValue } = params;
    const { type } = colDef;

    if (type === 'number' && isNaN(newValue)) {
      params.node.setDataValue(params.column.colId, null);
      console.log('Invalid input: Please enter a valid number.');
    }
    if (
      type === 'email' &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newValue)
    ) {
      params.node.setDataValue(params.column.colId, '');
      console.log('Invalid input: Please enter a valid email.');
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => renameColumn('name', 'Full Name')}>
          Rename "Name" to "Full Name"
        </button>
        <button onClick={() => changeColumnType('email', 'text')}>
          Change "Email" to Text
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => addNewColumn('text')}>Add Text Column</button>
        <button onClick={() => addNewColumn('number')}>
          Add Number Column
        </button>
        <button onClick={() => addNewColumn('email')}>Add Email Column</button>
        <button onClick={() => addNewColumn('multiselect')}>
          Add Tags Column
        </button>
        <button onClick={() => addNewColumn('checkbox')}>
          Add Checkbox Column
        </button>
      </div>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={{
          flex: 1,
          minWidth: 100,
          sortable: true,
          filter: true,
          resizable: true,
          editable: true,
        }}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
};

export default DataTable;
