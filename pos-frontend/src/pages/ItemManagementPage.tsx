import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: number;
  category: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string; 
}

const ItemManagementPage: React.FC = () => {
  const navigate = useNavigate(); 
  const [items, setItems] = useState<Item[]>([]);

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5154/api/Item', {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5154/api/Item/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        alert('Item deleted successfully');
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Item Management</h1>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <button
          style={{ padding: '10px 20px', borderRadius: '5px' }}
          onClick={() => navigate('/item-management/create')}
        >
          Add Item
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Category</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Price</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Stock</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Image</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.id}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.category}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.name}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.price}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.stock}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <img
                  src={`http://localhost:5154${item.imageUrl}`}
                  alt={item.name}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <button
                  style={{ marginRight: '10px' }}
                  onClick={() => navigate(`/item-management/edit/${item.id}`)}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ItemManagementPage;
