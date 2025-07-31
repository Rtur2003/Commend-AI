
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getHistory } from '../services/api'; // History servisini kullanacağız

// Bu component, login başarılı olduğunda gösterilecek
const AdminDashboard = ({ history, handleLogout }) => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>
      <hr />
      <h3>Statistics</h3>
      <p>Total Comments in History: <strong>{history.length}</strong></p>
      <hr />
      <button onClick={handleLogout} className="post-button">Logout</button>
    </div>
  );
};

// Ana Admin Sayfası Bileşeni
const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Sayfa yüklendiğinde oturum durumunu kontrol et
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/admin/check_auth', { withCredentials: true })
      .then(res => {
        if (res.data.is_admin) {
          setIsLoggedIn(true);
          getHistory().then(setHistory); // Giriş yapılmışsa geçmişi çek
        }
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/admin/login', { password }, { withCredentials: true });
      setIsLoggedIn(true);
      setError('');
      getHistory().then(setHistory); // Giriş yapınca geçmişi çek
    } catch (err) {
      setError('Invalid password.');
    }
  };

  const handleLogout = async () => {
    await axios.post('http://127.0.0.1:5000/api/admin/logout', {}, { withCredentials: true });
    setIsLoggedIn(false);
  };

  // Eğer giriş yapılmışsa Dashboard'u, değilse Login formunu göster
  if (isLoggedIn) {
    return <AdminDashboard history={history} handleLogout={handleLogout} />;
  }

  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default AdminPage;