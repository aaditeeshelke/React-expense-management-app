import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [totalSalary, setTotalSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [date, setDate] = useState('');
  const [monthSavings, setMonthSavings] = useState({});

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    const savedTotalSalary = localStorage.getItem('totalSalary');
    if (savedTotalSalary) {
      setTotalSalary(parseFloat(savedTotalSalary));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('totalSalary', totalSalary);
  }, [totalSalary]);

  // Function to add a new expense
  const addExpense = () => {
    if (newExpense && date && expenseCategory) {
      const expense = { id: Date.now(), amount: parseFloat(newExpense), category: expenseCategory, date };
      setExpenses([...expenses, expense]);
      setNewExpense('');
      setExpenseCategory('');
    }
  };

  // Function to remove an expense
  const removeExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
  };

  // Calculate total expenses for the current month
  const currentMonthExpenses = () => {
    const currentMonth = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
    return expenses.reduce((acc, expense) => {
      const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (expenseMonth === currentMonth) {
        return acc + expense.amount;
      }
      return acc;
    }, 0);
  };

  // Update month-wise savings
  const updateMonthSavings = () => {
    const currentMonth = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
    const totalExpenses = currentMonthExpenses();
    const updatedSavings = totalSalary - totalExpenses;
    setMonthSavings({ ...monthSavings, [currentMonth]: updatedSavings });
  };

  function getBackgroundColor(index) {
    const colors = ['purple-bg', 'green-bg', 'yellow-bg', 'orange-bg', 'blue-bg', 'red-bg'];
    return colors[index % colors.length];
  }

  return (
    <div className="App">
      <div className="left">
        <h1>Expense Management System</h1>
        <h2>Total Salary: ${totalSalary}</h2>
        <input
          type="number"
          value={totalSalary}
          onChange={(e) => setTotalSalary(parseFloat(e.target.value))}
          placeholder="Enter total salary"
        />
        <h2>Expenses:</h2>
        <input
          type="text"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          placeholder="Enter expense category"
        />
        <input
          type="number"
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
          placeholder="Enter expense amount"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addExpense}>Add Expense</button>
        <h2>Total Expenses for {new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })}: ${currentMonthExpenses()}</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td>${expense.amount}</td>
                <td>{expense.date}</td>
                <td><button onClick={() => removeExpense(expense.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="right">
        <h2>Month-wise Savings:</h2>
        <div className="month-savings">
          {Object.entries(monthSavings).map(([month, savings], index) => (
            <div className={`month-card ${getBackgroundColor(index)}`} key={month}>
              <table>
                <thead>
                  <tr>
                    <th colSpan="4">{month}</th>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Savings from Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(expense => {
                    const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                    if (expenseMonth === month) {
                      const expenseSavings = totalSalary - expense.amount;
                      return (
                        <tr key={expense.id}>
                          <td>{expense.category}</td>
                          <td>${expense.amount}</td>
                          <td>{expense.date}</td>
                          <td>${expenseSavings}</td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                  <tr>
                    <td colSpan="3">Total Salary</td>
                    <td>${totalSalary}</td>
                  </tr>
                  <tr>
                    <td colSpan="3">Total Savings</td>
                    <td>${savings}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
         
          <div className="total-savings">
            <h2>Total Savings from All Months:</h2>
            <p>${Object.values(monthSavings).reduce((acc, curr) => acc + curr, 0)}</p>
          </div>
        </div>
        <button onClick={updateMonthSavings}>Update Savings</button>
      </div>
    </div>
  );
}

export default App;
