import React from 'react';
import { Field , ErrorMessage, useFormikContext,useField} from 'formik';
import Select from 'react-select';
import { useState } from 'react';

export const InputField = ({ label, name }) => {
  const { touched } = useFormikContext();
  
  return (
    <div className="sm:col-span-3">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <Field
          id={name}
          name={name}
          type="text"
          className="block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        {touched[name] && (
          <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
        )}
      </div>
    </div>
  );
};


export const Upload = ({ label, name }) => {
  const { touched } = useFormikContext();
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    document.getElementById(name).value = null; // Clear the file input
  };

  return (
    <div className="col-span-5 row-span-1">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 p-1">
        <div className="text-center">
          {!fileName ? (
            <>
              <svg className="mx-auto h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="mt-2 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor={name}
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <Field
                    id={name}
                    name={name}
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              {touched[name] && (
                <ErrorMessage name={name} component="div" className="text-red-500 mt-1 text-xs leading-5" />
              )}
              <p className="text-xs leading-5 text-gray-600"> up to 10MB</p>
            </>
          ) : (
            <>
              <p className="text-md text-gray-700">{fileName}</p>
              <button
                type="button"
                className="mt-2 text-xs text-red-500 hover:underline"
                onClick={handleRemoveFile}
              >
                Remove file
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export const SelectField = ({ label, name, options, onChange }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (e) => {
    try {
      const selectedValue = e.target.value;
      setFieldValue(name, selectedValue);
      if (onChange) {
        onChange(e);
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }

  };

  return (
    <div className="sm:col-span-3">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-1">
        <select
          {...field}
          id={name}
          name={name}
          className="block w-full pl-3 pr-10 py-1.5 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={handleChange}
        >
          <option value="" label="Select option" />
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {meta.touched && meta.error ? (
          <div className="text-red-500 mt-1">{meta.error}</div>
        ) : null}
      </div>
    </div>
  );
};

// export const SelectField = ({ label, name, options, onChange }) => {
//   const { setFieldValue } = useFormikContext();
//   const [field, meta] = useField(name);

//   const handleChange = (e) => {
//     const selectedValue = e.target.value;
//     setFieldValue(name, selectedValue);
//     if (onChange) {
//       onChange(selectedValue);
//     }
//   };

//   return (
//     <div className="sm:col-span-3">
//       <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
//         {label}
//       </label>
//       <div className="mt-1">
//         <select
//           {...field}
//           id={name}
//           name={name}
//           className="block  w-full pl-3 pr-10 py-1.5 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           onChange={handleChange}
//         >
//           <option value="" label="Select option" />
//           {options.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//         {meta.touched && meta.error ? (
//           <div className="text-red-500 mt-1">{meta.error}</div>
//         ) : null}
//       </div>
//     </div>
//   );
// };


export const DateField = ({ label, name, placeholder }) => {
  const { touched } = useFormikContext();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="sm:col-span-3 relative">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <Field
          name={name}
          type="date"
          className="bg-white border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          max={today}
        />
      </div>
      {touched[name] && (
        <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
      )}
    </div>
  );
};


export const NumberInput = ({ name, label, placeholder, required = false }) => {
  const { touched } = useFormikContext();
  
  return (
    <div className="sm:col-span-3 mt-1">
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
        {label}
      </label>
      <Field
        type="number"
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        className="  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white border border-black text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {touched[name] && (
        <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
      )}
    </div>
  );
};

export const TextAreaField = ({ label, name }) => {
  const { touched } = useFormikContext();
  
  return (
    <div className="sm:col-span-6">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <Field
          id={name}
          name={name}
          as="textarea"
          rows="3"
          className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
        />
        {touched[name] && (
          <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
        )}
      </div>
    </div>
  );
};
export const MultiSelect = ({ label, options, name }) => {
  const { setFieldValue, touched, errors } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (selectedOptions) => {
    const value = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFieldValue(name, value);
  };

  const selectedValues = options.filter(option => field.value.includes(option.value));

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select
        isMulti
        name={name}
        options={options}
        value={selectedValues}
        onChange={handleChange}
        onBlur={() => setFieldValue(name, field.value)} // Set field value on blur
        className="mt-2"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const RadioButton = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const [isChecked, setIsChecked] = useState(field.checked);

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    field.onChange(e); // Call Formik's onChange
  };

  return (
    <div className="flex items-center mb-4">
      <input
        {...field}
        {...props}
        type="radio"
        checked={isChecked}
        onChange={handleChange}
        className={`w-4 h-4 border-black focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-white focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
          isChecked ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
       }`}
      />
      <label
        htmlFor={props.id || props.name}
        className="ml-2 text-sm font-medium text-gray-900 dark:text-black"
      >
        {label}
      </label>
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

// export const RadioButton = ({ label, ...props }) => {
//  \
//   const [field, meta] = useField(props);

//   return (
//     <div className="flex items-center mb-4">
//       <input
//         {...field}
//         {...props}
//         type="radio"
//         className={w-4 h-4 border-black focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-white focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
//           field.checked ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
//         }}
//       />
//       <label
//         htmlFor={props.id || props.name}
//         className="ml-2 text-sm font-medium text-gray-900 dark:text-black"
//       >
//         {label}
//       </label>
//       {meta.touched && meta.error ? (
//         <div className="text-red-600 text-sm">{meta.error}</div>
//       ) : null}
//     </div>
//   );
// // };  