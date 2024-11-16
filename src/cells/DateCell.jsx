import React, { useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import DatePicker from 'react-datepicker';  // Import datepicker
import "react-datepicker/dist/react-datepicker.css";  // Import styles for datepicker
import { ActionTypes } from '../utils';

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};


export default function DateCell({
    initialValue,
    columnId,
    rowIndex,
    dataDispatch,
}) {
    const [value, setValue] = useState({ value: initialValue, update: false });
    const [isEditing, setIsEditing] = useState(false); // Track whether we are editing the date

    function onChange(e) {
        setValue({ value: e.target.value, update: false });
    }

    function onBlur(e) {
        setValue(old => ({ value: old.value, update: true }));
        setIsEditing(false);  // Stop editing when blur happens
    }

    function onDateChange(date) {
        setValue({ value: date, update: false });
    }

    useEffect(() => {
        setValue({ value: initialValue, update: false });
    }, [initialValue]);

    useEffect(() => {
        if (value.update) {
            dataDispatch({
                type: ActionTypes.UPDATE_CELL,
                columnId,
                rowIndex,
                value: value.value,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.update, columnId, rowIndex]);

    const renderContent = () => {
        if (isEditing) {
            // If editing, show the date picker
            return (
                <DatePicker
                    selected={value.value}
                    onChange={onDateChange}
                    autoFocus={true}
                    onBlur={onBlur}
                    className="data-input "
                    dateFormat="MMM dd yyyy"
                />
            );
        } else {
            // If not editing, just show the value as text
            return (
                <ContentEditable
                    html={(value.value && value.value.toString().slice(4, 16)) || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="data-input "
                    onFocus={() => setIsEditing(true)} // Trigger date picker when focused
                />
            );
        }
    };

    return renderContent();
}
