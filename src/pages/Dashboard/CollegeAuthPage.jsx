import { useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import Header from '../../components/Header';
import Table from '../../components/Table';
import DetailBox from '../../components/DetailBox';
import api from '../../api/api';

export default function CollegeAuthPage() {
  const { college_auths, users, partners, setToast, setData } = useOutletContext();
  const [selected, setSelected] = useState(null) 
 
  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: '사용자 이름', 
      accessor: 'user_name',
      Cell: ({ row }) => {
        const user = users.find(user => user.id === row.original.user_id);
        return user ? user.name : '알 수 없음';
      }
     },
    { Header: '요청일', accessor: 'created_at' },
  ], [users]);

  const detailMetaData = [
    { title: '이미지', label: 'info21_image', type: 'big-image' },
    { title: '이름', label: 'name', type: 'text', isEditable: false },
    { title: '요청일', label: 'created_at', type: 'date', isEditable: false },
    {
      title: '단과대',
      label: 'colleges',
      type: 'multi-select',
      isEditable: true,
      options: partners.map(partner => ({ value: partner.id, label: partner.name }))
    },
  ];

  const handleApprove = async (data) => {
    if (!data.colleges || data.colleges.length === 0) {
      setToast({ message: '단과대를 입력해주세요.', isSuccess: false });
      return;
    }

    try {
      await api.patch(`college_auths/${data.user_id}`, {
        status: 'accepted',
        colleges: data.colleges,
      });

      setData(prev => ({
        ...prev,
        college_auths: prev.college_auths.filter(auth => auth.id !== data.id),
      }));
      setToast({ message: '단과대 인증이 승인되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast(e);
    }
  };

  const handleReject = async (data) => {
    try {
      await api.patch(`college_auths/${data.user_id}`, { status: 'rejected' });

      setData(prev => ({
        ...prev,
        college_auths: prev.college_auths.filter(auth => auth.id !== data.id),
      }));
      setToast({ message: '단과대 인증이 거절되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast(e);
    }
  };

  const handleRowClick = (row) => {
    setSelected({
      ...row,
      name: users.find(user => user.id === row.user_id)?.name || '알 수 없음',
    });
  };

  return (
    <>
      <Header title="단과대 인증" />
      <PageDiv>
        <div style={{ flex: selected ? 4 : 1 }}>
          <Table key="college_auths" columns={columns} data={college_auths} onRowClick={handleRowClick} />
        </div>
        {selected && 
        <div flex={3} style={{height: '100px'}}>
          <DetailBox 
            data={selected} 
            metaData={detailMetaData} 
            onApprove={handleApprove} 
            onReject={handleReject}/>
        </div>
        }
      </PageDiv>
    </>
  )
}

const PageDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;