import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout() {
  const [data, setData] = useState({
    users: [],
    college_auths: [],
    stores: [],
    partners: [],
    partnerships: [],
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message: '', isSuccess: true/false }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/main');
        setData(res.data);
      } catch (e) {
        console.error('데이터 로드 실패', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return <LoadingDiv>로딩중...</LoadingDiv>;

  return (
    <DashboardDiv>
      <Sidebar />
      <RightContentDiv>
        <Outlet context={{ 
            ...data, 
            setToast,
            setData 
        }} />
        {toast && (
          <ToastDiv isSuccess={toast.isSuccess}>{toast.message}</ToastDiv>
        )}
      </RightContentDiv>
    </DashboardDiv>
  );
}

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
`;

const DashboardDiv = styled.div`
  display: flex;
`;

const RightContentDiv = styled.div`
  flex: 1;
  padding: 20px;
  position: relative;
`;

const ToastDiv = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  border: 2px solid ${props => (props.isSuccess ? '#2ecc71' : '#e74c3c')};
  color: ${props => (props.isSuccess ? '#2ecc71' : '#e74c3c')};
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 999;
`;
