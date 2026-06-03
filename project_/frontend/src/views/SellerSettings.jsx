import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SellerSettings = () => {
  const { user, updateRestaurantLink } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [name, setName] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchRestaurant = async () => {
    if (!user?.restaurantId) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/restaurants/${user.restaurantId}`);
      if (res.data.success) {
        const rest = res.data.data.restaurant;
        setRestaurant(rest);
        
        setName(rest.name);
        setCuisineType(rest.cuisineType);
        setAddress(rest.address);
        setOpeningHours(rest.openingHours);
        setDescription(rest.description);
        setImageUrl(rest.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching restaurant settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitLoading(true);

    if (!name || !cuisineType || !address || !openingHours || !description) {
      setFormError('Please fill in all required fields.');
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        name,
        cuisineType,
        address,
        openingHours,
        description,
        imageUrl: imageUrl.trim() || undefined
      };

      let res;
      if (restaurant) {
        // Edit existing
        res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/restaurants/${restaurant._id}`, payload);
      } else {
        // Create new
        res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/restaurants`, payload);
      }

      if (res.data.success) {
        setFormSuccess(restaurant ? 'Storefront details saved successfully!' : 'Restaurant storefront established successfully!');
        const updatedRest = res.data.data;
        setRestaurant(updatedRest);
        
        // Sync context
        if (!restaurant) {
          updateRestaurantLink(updatedRest._id);
        }
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Action failed. Name might already be taken.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        gap: '1rem'
      }}>
        <div className="pulse-glow-box" style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid var(--accent-gold)',
          borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Configuring settings board...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem', paddingBottom: '5rem', maxWidth: '800px' }}>
      <h1 style={{
        fontFamily: 'var(--font-title)',
        fontSize: '2.2rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <i className="fa-solid fa-gears" style={{ color: 'var(--accent-gold)' }}></i>
        Storefront Configurations
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        {restaurant
          ? 'Modify and fine-tune your public store card and kitchen hours.'
          : 'Establish your brand storefront. Create restaurant details to start building menus and receiving customer orders.'}
      </p>

      <div className="glass-panel" style={{ padding: '2.5rem 2rem', background: 'var(--bg-secondary)' }}>
        
        {formError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: 'var(--accent-coral)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i>
            {formError}
          </div>
        )}

        {formSuccess && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            color: 'var(--accent-gold)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }}></i>
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="restName">Brand Store Name</label>
              <input
                id="restName"
                type="text"
                className="form-input"
                placeholder="e.g. Trattoria Toscana"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="restCuisine">Cuisine Genre</label>
              <input
                id="restCuisine"
                type="text"
                className="form-input"
                placeholder="e.g. Italian, Japanese Fusion"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="restAddress">Physical Address</label>
              <input
                id="restAddress"
                type="text"
                className="form-input"
                placeholder="e.g. 42 Gourmet Way, Suite 1B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="restHours">Opening Hours</label>
              <input
                id="restHours"
                type="text"
                className="form-input"
                placeholder="e.g. 11:00 AM - 11:00 PM"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="restDesc">Brand Story / Short Description</label>
            <textarea
              id="restDesc"
              className="form-input"
              rows="4"
              placeholder="Tell your customers about your culinary heritage, chef credentials, or kitchen environment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="restCover">Cover Showcase Image URL (Unsplash link recommended)</label>
            <input
              id="restCover"
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitLoading} style={{
            width: '100%',
            padding: '0.9rem',
            fontSize: '1.05rem',
            marginTop: '1.5rem'
          }}>
            {submitLoading ? 'Saving Configurations...' : restaurant ? 'Save Configurations' : 'Establish Storefront'}
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SellerSettings;
