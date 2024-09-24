import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header.jsx';
import Cards from '../components/Cards/Cards.jsx';
import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/AddExpense.jsx';
import AddIncomeModal from '../components/Modals/AddIncome.jsx';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db} from '../firebase.js';
import {toast} from "react-toastify";
import moment from "moment";
import TransactionTable from '../components/TransactionsTable/TransactionTable.jsx';
import ChartComponents from '../components/Charts/Charts.jsx';
import NoTransactions from '../components/Notransaction/Notransaction.jsx';

function Dashboard (){
  // const transactions = [
  //   {
  //     type : "income",
  //     amount : 1200,
  //     tag : "salary",
  //     name : "income 1",
  //     date: "2023-05-23",
  //   },
  //   {
  //     type : "expense",
  //     amount : 800,
  //     tag : "food",
  //     name : "expense 1",
  //     date: "2023-05-17",
  //   },
  // ];
  const [transactions, setTransactions] = useState([]);
  const [loading, setloading] = useState(false);
  const [user] = useAuthState(auth);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    }; 
    console.log("New Transaction", newTransaction);
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transactions);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
   
    }
  }
  useEffect(() =>{
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setloading(true);  
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array", transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setloading(false);
  }

  let sortedTransactions = transactions.sort((a,b) =>{
      return new Date(a.date) - new Date(b.date);
  });
  return(
    <div>
      <Header/>
      {loading ?(
        <p>Loading...</p>  
        ) : (
      <>
      <Cards   
      income = {income}
      expense = {expense}
      totalBalance = {totalBalance}
      showIncomeModal = {showIncomeModal}
      showExpenseModal = {showExpenseModal}
      />
      {transactions && transactions.length != 0 ? (
      <ChartComponents sortedTransactions ={sortedTransactions} />
      ) : (
      <NoTransactions/>
      )}
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <TransactionTable 
        transactions = {transactions}
        addTransaction={addTransaction}
        fetchTransactions={fetchTransactions}
      />
      </>
    )}
    </div>
  );
} 

export default Dashboard;  