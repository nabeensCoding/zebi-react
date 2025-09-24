import { useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import Header from '../../components/Header';
import Table from '../../components/Table';
import DetailBox from '../../components/DetailBox';
import api from '../../api/api';

export default function PartnershipsPage() {
  const { partnerships, partners, stores, setData, setToast } = useOutletContext();
  const [selected, setSelected] = useState(null);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: '가게 ID', accessor: 'store_id' },
    { Header: '단과대 ID', accessor: 'partner_id' },
    { Header: '간단 설명', accessor: 'short_description' },
    { Header: '상세 설명', accessor: 'long_description' },
    { Header: '생성일', accessor: 'created_at' },
  ], []);

  const detailMetaData = [
    {
      title: '가게',
      label: 'store_id',
      type: 'select',
      isEditable: true,
      options: stores.map(store => ({ value: store.id, label: store.name }))
    },
    {
      title: '단과대',
      label: 'partner_id',
      type: 'select',
      isEditable: true,
      options: partners.map(partner => ({ value: partner.id, label: partner.name }))
    },
    { title: '간단 설명', label: 'short_description', type: 'text', isEditable: true },
    { title: '상세 설명', label: 'long_description', type: 'textarea', isEditable: true },
    { title: '생성일', label: 'created_at', type: 'date', isEditable: false },
  ];

  const handleNew = () => {
    setSelected({
      id: null,
      store_id: '',
      partner_id: '',
      short_description: '',
      long_description: '',
      created_at: '',
    });
  };

  const handleSave = (data) => {
    if (data.id) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const handleCreate = async (data) => {
    const { store_id, partner_id, short_description, long_description } = data;

    if (!store_id || !partner_id || !short_description || !long_description) {
      setToast({ message: '모든 필드를 입력해주세요.', isSuccess: false });
      return;
    }

    try {
      const res = await api.post('partnerships', {
        store_id,
        partner_id,
        short_description,
        long_description
      });

      const newItem = res.data.partnership;

      setData(prev => ({
        ...prev,
        partnerships: [...prev.partnerships, newItem],
      }));

      setToast({ message: '제휴가 추가되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast({ message: e.message || '추가 중 오류 발생', isSuccess: false });
    }
  };

  const handleUpdate = async (data) => {
    const { id, store_id, partner_id, short_description, long_description } = data;

    if (!id || !store_id || !partner_id || !short_description || !long_description) {
      setToast({ message: '모든 필드를 입력해주세요.', isSuccess: false });
      return;
    }

    try {
      const res = await api.put(`partnerships/${id}`, {
        store_id,
        partner_id,
        short_description,
        long_description
      });

      const updated = res.data.partnership;

      setData(prev => ({
        ...prev,
        partnerships: prev.partnerships.map(p => p.id === id ? updated : p),
      }));

      setToast({ message: '제휴 정보가 업데이트되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast({ message: e.message || '업데이트 중 오류 발생', isSuccess: false });
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      await api.delete(`partnerships/${id}`);

      setData(prev => ({
        ...prev,
        partnerships: prev.partnerships.filter(p => p.id !== id),
      }));

      setToast({ message: '제휴가 삭제되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast({ message: e.message || '삭제 중 오류 발생', isSuccess: false });
    }
  };

  return (
    <>
      <Header title="제휴" onClick={handleNew} />
      <PageDiv>
        <div style={{ flex: selected ? 4 : 1 }}>
          <Table key="partnerships" columns={columns} data={partnerships} onRowClick={setSelected} />
        </div>
        {selected &&
          <div flex={3} style={{height: '100px'}}>
            <DetailBox
              data={selected}
              metaData={detailMetaData}
              onApprove={handleSave}
              approveTitle={selected.id ? '수정하기' : '추가하기'}
              onReject={selected.id ? () => handleDelete(selected.id) : null}
              rejectTitle="삭제하기"
            />
          </div>
        }
      </PageDiv>
    </>
  );
}

const PageDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;
