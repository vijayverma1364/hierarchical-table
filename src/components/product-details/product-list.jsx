import React, { Fragment, useState } from 'react'
import InputElement from '../common/input';
import Button from '../common/button/button';


const ProductList = ({ row, updateValue }) => {
  const [inputValue, setInputValue] = useState(null);
  const [error, setError] = useState({
    input: false
  });

  const checkValidation = () => {
    if (!inputValue) {
      setError({
        input: !inputValue,
      })
      return true;
    }
    return false;
  }

  const handleUpdate = (newValue, isPercentage) => {
    if (checkValidation()) {
      return null
    }
    const updatedValue = isPercentage ? row.value + (row.value * newValue / 100) : newValue;
    updateValue(row, updatedValue, isPercentage, inputValue);
    setInputValue(null)
  };

  const handleAllocationPercentage = () => {
    if (checkValidation()) {
      return null
    }
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      handleUpdate(percentage, true);
    }
  };

  const handleAllocationValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      handleUpdate(value, false);
    }
  };

  return (
    <Fragment>
      <tr className={`${row.group && 'group-item'}`}>
        <td>{row.label}</td>
        <td>{row.value}</td>

        <td>
          <InputElement
            type='number'
            value={inputValue || ''}
            onChange={(value) => setInputValue(value)}
            error={error?.input && inputValue === null}
          />
        </td>
        <td>
          <Button label={'Allocation %'} onClick={handleAllocationPercentage} />
        </td>
        <td>
          <Button label={'Allocation Val'} onClick={handleAllocationValue} />
        </td>
        <td>{row?.totalVariance ?? (row?.variance || 0)}%</td>
      </tr>
      {row?.children && row?.children?.map(child => (
        <ProductList key={child.id} row={child} updateValue={updateValue} />
      ))}
    </Fragment>
  )
}

export default ProductList;