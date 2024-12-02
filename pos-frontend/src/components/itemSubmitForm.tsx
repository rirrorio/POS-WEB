import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ItemForm.css'

interface ItemFormProps {
  action: 'create' | 'edit';
}

interface Item {
  id: number;
  category: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

const ItemForm: React.FC<ItemFormProps> = ({ action }) => {
  const [itemData, setItemData] = useState<Item>({
    id: 0,
    category: '',
    name: '',
    price: 0,
    stock: 0,
    imageUrl: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const navigate = useNavigate();  // Using useNavigate instead of useHistory
  const { itemId } = useParams<{ itemId: string }>();

  // Fetch item data if it's an edit action
  useEffect(() => {
    if (action === 'edit' && itemId) {
      const fetchItemData = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`http://localhost:5154/api/Item/${itemId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setItemData(data);
        } catch (error) {
          console.error('Error fetching item data:', error);
        }
      };
      fetchItemData();
    }
  }, [action, itemId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('name', itemData.name);
    data.append('category', itemData.category);
    data.append('price', itemData.price.toString());
    data.append('stock', itemData.stock.toString());
    if (image) {
      data.append('image', image);
    }

    const url = action === 'edit' ? `http://localhost:5154/api/Item/${itemData.id}` : 'http://localhost:5154/api/Item';
    const method = action === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        navigate('/item-management');  // Use navigate instead of history.push
      } else {
        console.error('Failed to submit item');
      }
    } catch (error) {
      console.error('Error submitting item:', error);
    }
  };

  return (
    <div>
    <h1>{action === 'edit' ? 'Edit Item' : 'Create Item'}</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={itemData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={itemData.category}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={itemData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={itemData.stock}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" onChange={handleImageChange} />
      </div>
      <button type="submit">{action === 'edit' ? 'Update Item' : 'Create Item'}</button>
    </form>
  </div>
  );
};

export default ItemForm;
