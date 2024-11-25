import React, { useEffect, useState } from 'react'
import ProductList from './product-list';


const initialData = [
  {
    id: "_id0001",
    label: "Electronics",
    value: 1500,
    group: true,
    totalVariance: 0,
    children: [
      {
        id: "_idElc_0001",
        label: "Phones",
        value: 800,
      },
      {
        id: "_idElc_0002",
        label: "Laptops",
        value: 700,
      },
    ],
  },
  {
    id: "_id0002",
    label: "Furniture",
    value: 1000,
    group: true,
    totalVariance: 0,
    children: [
      {
        id: "_idFurn_0001",
        label: "Tables",
        value: 300,
      },
      {
        id: "_idFurn_0002",
        label: "Chairs",
        value: 700,
      },
    ],
  },
]

const ProductDetails = () => {
  const [productList, setProductList] = useState(initialData || []);
  const [grandTotal, setGrandTotal] = useState(0);

  const updateValue = (rowItem, newValue, isPercentage = false, inputValue) => {
    const updateRows = (rows) => {
      return rows.map(row => {
        if (row.id === rowItem.id) {
          if (row.children) {
            const totalInitialValue = row.children.reduce((sum, child) => sum + child.value, 0);
            const updatedChildren = row.children.map(child => {
              const ratio = child.value / totalInitialValue;
              const updatedChildValue = isPercentage ? child.value + (child.value * inputValue / 100) : (newValue * ratio);
              const childVariance = inputValue * ratio;

              return {
                ...child,
                value: parseFloat(updatedChildValue.toFixed(2)),
                variance: isPercentage ? childVariance.toFixed(2) : 0
              };
            });

            const updatedParentValue = updatedChildren.reduce((sum, child) => sum + child.value, 0);
            const parentVariance = ((updatedParentValue - row.value) / row.value) * 100;
            return {
              ...row,
              value: parseFloat(updatedParentValue.toFixed(2)),
              totalVariance: isPercentage ? parentVariance.toFixed(2) : row?.totalVariance,
              children: updatedChildren
            };
          } else {
            const variance = ((newValue - row.value) / row.value) * 100;
            return {
              ...row,
              value: parseFloat(newValue.toFixed(2)),
              variance: isPercentage ? variance.toFixed(2) : 0
            };
          }
        } else if (row.children) {
          const updatedChildren = updateRows(row.children);
          const updatedParentValue = updatedChildren.reduce((sum, child) => sum + child.value, 0);
          const parentVariance = Math.abs(((updatedParentValue - row.value) / row.value) * 100);
          return {
            ...row,
            value: parseFloat(updatedParentValue.toFixed(2)),
            totalVariance: parentVariance ? parentVariance.toFixed(2) : row?.totalVariance,
            children: updatedChildren
          };
        }
        return row;
      });
    };
    setProductList(prevData => updateRows(prevData));
  };

  useEffect(() => {
    const calculateTotalValue = (children) => {
      return children.reduce((sum, child) => sum + child.value, 0);
    };

    const calculateGrandTotal = (rows) => {
      return rows.reduce((total, row) => {
        if (row.group) {
          return total + calculateTotalValue(row.children);
        } else {
          return total + row.value;
        }
      }, 0);
    };
    setGrandTotal(calculateGrandTotal(productList))
  }, [productList])


  return (
    <table>
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>
        {productList?.map(row => (
          <ProductList key={row.id} row={row} updateValue={updateValue} />
        ))}
        <tr className='grand-total'>
          <td>Grand Total</td>
          <td>{grandTotal}</td>
          <td colSpan="4"></td>
        </tr>
      </tbody>
    </table>
  )
}

export default ProductDetails;