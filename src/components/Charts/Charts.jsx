import React from 'react';
import { Line, Pie } from '@ant-design/charts';
import './Charts.css';

function ChartComponents({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const spendingData = sortedTransactions.filter((transaction) => {
    return transaction.type === 'expense';
  });

  let newSpendings = [
    { tag: 'food', amount: 0 },
    { tag: 'education', amount: 0 },
    { tag: 'office', amount: 0 },
  ];

  
  spendingData.forEach((item) => {
    if (item.tag === 'food') {
      newSpendings[0].amount += item.amount;
    } else if (item.tag === 'education') {
      newSpendings[1].amount += item.amount;
    } else {
      newSpendings[2].amount += item.amount;
    }
  });

  const config = {
    data: data,
    width: 500,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
  };

  const spendingConfig = {
    data: newSpendings,
    width: 500,
    angleField: 'amount',
    colorField: 'tag',
    color: ({ tag }) => {
      if (tag === 'food') {
        return '#ff0000'; 
      } else if (tag === 'education') {
        return '#52c41a'; 
      } else if (tag === 'office') {
        return '#1890ff'; 
      }
      return '#999999'; 
    },
  };

  return (
    <div className="charts-wrapper">
      <div className='charts-line'>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line {...config} />
      </div>
      <div>
        <h2>Your Spending</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
}

export default ChartComponents;
