import React, { useEffect, useReducer } from 'react';
import './style.css';
import Table from './Table';
import {
  randomColor,
  shortId,
  makeData,
  ActionTypes,
  DataTypes,
} from './utils';
import update from 'immutability-helper';
import axios from 'axios';
// import DataTable from './GridTable';
// import PlayGround from './PlayGround';

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_OPTION_TO_COLUMN:
      const optionIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: {
          [optionIndex]: {
            options: {
              $push: [
                {
                  label: action.option,
                  backgroundColor: action.backgroundColor,
                },
              ],
            },
          },
        },
      });
    case ActionTypes.ADD_ROW:
      return update(state, {
        skipReset: { $set: true },
        data: { $push: [{}] },
      });
    case ActionTypes.UPDATE_COLUMN_TYPE:
      const typeIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      switch (action.dataType) {
        case DataTypes.NUMBER:
          if (state.columns[typeIndex].dataType === DataTypes.NUMBER) {
            return state;
          } else {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
              data: {
                $apply: data =>
                  data.map(row => ({
                    ...row,
                    [action.columnId]: isNaN(row[action.columnId])
                      ? ''
                      : Number.parseInt(row[action.columnId]),
                  })),
              },
            });
          }
        case DataTypes.SELECT:
          if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return state;
          } else {
            let options = [];
            state.data.forEach(row => {
              if (row[action.columnId]) {
                options.push({
                  label: row[action.columnId],
                  backgroundColor: randomColor(),
                });
              }
            });
            return update(state, {
              skipReset: { $set: true },
              columns: {
                [typeIndex]: {
                  dataType: { $set: action.dataType },
                  options: { $push: options },
                },
              },
            });
          }
        case DataTypes.TEXT:
          if (state.columns[typeIndex].dataType === DataTypes.TEXT) {
            return state;
          } else if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
            });
          } else {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
              data: {
                $apply: data =>
                  data.map(row => ({
                    ...row,
                    [action.columnId]: row[action.columnId] + '',
                  })),
              },
            });
          }
        case DataTypes.DATE:
          if (state.columns[typeIndex].dataType === DataTypes.DATE) {
            return state; // No change needed if already of type DATE
          } else {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
              data: {
                $apply: data =>
                  data.map(row => ({
                    ...row,
                    [action.columnId]: isNaN(Date.parse(row[action.columnId]))
                      ? ''
                      : new Date(row[action.columnId]).toISOString(), // Ensure consistent date formatting
                  })),
              },
            });
          }

        default:
          return state;
      }
    case ActionTypes.UPDATE_COLUMN_HEADER:
      const index = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { [index]: { label: { $set: action.label } } },
      });
    case ActionTypes.UPDATE_CELL:
      return update(state, {
        skipReset: { $set: true },
        data: {
          [action.rowIndex]: { [action.columnId]: { $set: action.value } },
        },
      });
    case ActionTypes.ADD_COLUMN_TO_LEFT:
      const leftIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      let leftId = shortId();
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $splice: [
            [
              leftIndex,
              0,
              {
                id: leftId,
                label: 'Column',
                accessor: leftId,
                dataType: DataTypes.TEXT,
                created: action.focus && true,
                options: [],
              },
            ],
          ],
        },
      });
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      const rightIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      const rightId = shortId();
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $splice: [
            [
              rightIndex + 1,
              0,
              {
                id: rightId,
                label: 'Column',
                accessor: rightId,
                dataType: DataTypes.TEXT,
                created: action.focus && true,
                options: [],
              },
            ],
          ],
        },
      });
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { $splice: [[deleteIndex, 1]] },
      });
    case ActionTypes.ENABLE_RESET:
      return update(state, { skipReset: { $set: true } });
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, makeData(10));

  const syncDataWithApi = async tableState => {
    const payload = {
      data: tableState.data, // Only cell data
      columns: tableState.columns, // Include columns if structure changes need saving
    };

    try {
      await axios.post('/api/save-data', payload);
      console.log('Data synced with the server successfully.');
    } catch (error) {
      console.error('Failed to sync data:', error);
    }
  };

  useEffect(() => {
    console.log('Updated data after dispatch:', state);

    // Call sync function here if needed
    syncDataWithApi(state);
  }, [state]);

  useEffect(() => {
    dispatch({ type: ActionTypes.ENABLE_RESET });
  }, [state.data, state.columns]);

  return (
    <div
      className="overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        padding: 10,
        // backgroundColor: "green"
      }}
    >
      {/* <div style={{ marginBottom: 40, marginTop: 40 }}>
        <h1>Editable React Table - Demo</h1>
      </div> */}
      <Table
        columns={state.columns}
        data={state.data}
        dispatch={dispatch}
        skipReset={state.skipReset}
        selectableRows="single"
        // onSelectedRowsChange={handleChangeRow}

        // clearSelectedRows={toggledClearRows}
      />

      <div id="popper-portal"></div>
    </div>
  );
}

export default App;

{
  /* <div style={{
  minHeight: "300px"
}}>

  <PlayGround />
</div>
<DataTable /> */
}
