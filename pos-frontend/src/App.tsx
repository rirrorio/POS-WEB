import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemManagementPage from './pages/ItemManagementPage';
import ItemForm from './components/itemSubmitForm';
import TransactionPage from './pages/TransactionPage'; 
import Navbar from './components/navbar';
import LoginPage from './pages/LoginPage'; // Make sure to create this page component
import TransactionForm from './components/transactionSubmitForm'

const App: React.FC = () => {
  return (
    <Router>
      <Navbar /> {/* Show Navbar on all pages except Login */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/item-management" element={<ItemManagementPage />} />
        <Route path="/item-management/create" element={<ItemForm action="create" />} />
        <Route path="/item-management/edit/:itemId" element={<ItemForm action="edit" />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/transaction/create" element={<TransactionForm />} />
      </Routes>
    </Router>
  );
};

export default App;
