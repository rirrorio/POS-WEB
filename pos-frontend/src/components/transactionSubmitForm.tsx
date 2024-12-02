import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/transactionForm.css'

type Item = {
  id: number;
  name: string;
  price: number;
};

const TransactionForm: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5154/api/Item', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem === 0 || quantity <= 0) {
      setError('Please select an item and quantity');
      return;
    }

    try {
      const response = await fetch('http://localhost:5154/api/Transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          itemId: selectedItem,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        navigate('/transaction'); // Redirect to the transaction list page
      } else {
        setError('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Error creating transaction');
    }
  };

  return (
    <div>
      <h1>Create Transaction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(Number(e.target.value))}
          >
            <option value={0}>Select an item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.price}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TransactionForm;
