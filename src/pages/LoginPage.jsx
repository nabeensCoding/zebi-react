import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/api';

export default function LoginPage(){
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password) {
      setError('아이디와 비밀번호를 입력하세요.');
    }

    try {
      const res = await api.post('login', { name, password }); 
      const { accessToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      navigate('/users');
    } catch (e) {
      setError(`로그인 실패. 다시 시도해 주세요. ${e}`);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <input
          placeholder="아이디"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};