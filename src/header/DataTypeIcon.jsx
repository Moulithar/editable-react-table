import React from 'react';
import { DataTypes } from '../utils';
import TextIcon from '../img/Text';
import MultiIcon from '../img/Multi';
import HashIcon from '../img/Hash';
import CalendarIcon from '../img/Calendar';

export default function DataTypeIcon({ dataType }) {
  function getPropertyIcon(dataType) {
    switch (dataType) {
      case DataTypes.NUMBER:
        return <HashIcon />;
      case DataTypes.TEXT:
        return <TextIcon />;
      case DataTypes.SELECT:
        return <MultiIcon />;
      case DataTypes.DATE:
        return <CalendarIcon />;
      default:
        return null;
    }
  }

  return getPropertyIcon(dataType);
}
