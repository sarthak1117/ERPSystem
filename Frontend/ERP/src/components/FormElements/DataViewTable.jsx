import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import { FaFileExcel, FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';
import 'jspdf-autotable';

const DataViewTable = ({
  data = [],
  fields = [],
  onEdit,
  onDelete,
  heading,
  selectable,
  onSelect,
  onDeleteAction,
  formikFieldName,
  setFieldValue,
  Actions,
  values,
  button,
  onButtonClick,
  onClickButtonTwo,
  buttonTwo,
  customActions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) =>
    fields.some(
      (field) =>
        row[field.key] &&
        row[field.key].toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const newSelectedRows = isSelected
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
    onSelect(newSelectedRows);
    setAllSelected(false);
    if (setFieldValue) {
      setFieldValue(formikFieldName, newSelectedRows);
    }
  };

  const handleSelectAll = () => {
    if (!allSelected) {
      const allRowIds = filteredData.map((row) => row._id);
      setSelectedRows(allRowIds);
      onSelect(allRowIds);
      if (setFieldValue) {
        setFieldValue(formikFieldName, allRowIds);
      }
    } else {
      setSelectedRows([]);
      onSelect([]);
      if (setFieldValue) {
        setFieldValue(formikFieldName, []);
      }
    }
    setAllSelected(!allSelected);
  };

  const downloadExcel = () => {
    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFile(wb, ${heading}.xlsx);
  };

  const downloadCSV = () => {
    const ws = utils.json_to_sheet(filteredData);
    const csv = utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ${heading}.csv;
    a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(heading, 20, 10);
    doc.autoTable({
      head: [fields.map((field) => field.label)],
      body: filteredData.map((row) =>
        fields.map((field) =>
          typeof row[field.key] === 'object'
            ? JSON.stringify(row[field.key])
            : row[field.key]
        )
      ),
    });
    doc.save(${heading}.pdf);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      onDeleteAction(selectedRows);
    } else {
      onDeleteAction();
    }
  };

  return (
    <div className="mt-6 -ml-4">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <h2 className="ml-3 mt-2 text-2xl font-semibold leading-7 text-gray-900">
          {heading}
        </h2>
        <div className="flex justify-end -mt-8 mr-4">
          {(selectedRows.length > 0 || (selectable && filteredData.length > 0)) && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={handleDelete}
            >
              {selectedRows.length > 0 ? 'Delete Selected' : 'Delete'}
            </button>
          )}
          <div className='flex space-x-1'>
            {button && (
              <div className="flex justify-end">
                <button
                  onClick={onButtonClick} // Use the passed function here
                  className="bg-green-900 hover:bg-green-600 text-white text-sm py-1 px-3 rounded"
                >
                  {button}
                </button>
              </div>
            )}
            {buttonTwo && (
              <div className="flex justify-end">
                <button
                  onClick={onClickButtonTwo} // Use the passed function here
                  className="bg-green-900 hover:bg-green-600 text-white text-sm py-1 px-3 rounded"
                >
                  {buttonTwo}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="px-6 py-3 mt-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-x-2 px-6 py-3 mt-3">
            <button onClick={downloadExcel} className="hover:text-green-700">
              <FaFileExcel />
            </button>
            <button onClick={downloadCSV} className="hover:text-blue-700">
              <FaFileCsv />
            </button>
            <button onClick={downloadPDF} className="hover:text-red-700">
              <FaFilePdf />
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="form-checkbox"
                  />
                </th>
              )}
              {fields.map((field, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {selectable && (
                    <td className="px-4 py-1 mt-1 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row._id)}
                        onChange={() => handleRowSelect(row._id)}
                        className="form-checkbox"
                      />
                    </td>
                  )}
                  {fields.map((field, fieldIndex) => (
                    <td
                      key={fieldIndex}
                      className="px-4 py-1 mt-1 whitespace-nowrap text-sm text-gray-500"
                    >
                      {field.render
                        ? field.render(row)
                        : typeof row[field.key] === 'object'
                        ? JSON.stringify(row[field.key])
                        : row[field.key]}
                    </td>
                  ))}
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    {onEdit && (
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={() => onEdit(row)}
                      >
                        <MdEdit />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => onDelete(row._id)}
                      >
                        <MdDelete />
                      </button>
                    )}
                    {customActions && customActions(row)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={fields.length + (selectable ? 2 : 1)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan={fields.length + (selectable ? 2 : 1)}
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 text-center"
              >
                Total Records: {filteredData.length}
                {selectedRows.length > 0 && (
                  <span>, Selected: {selectedRows.length}</span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DataViewTable; 
