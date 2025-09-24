import { useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import Header from '../../components/Header';
import Table from '../../components/Table';
import DetailBox from '../../components/DetailBox';
import api from '../../api/api';

export default function StoresPage() {
  const { stores, setData, setToast } = useOutletContext();
  const [selected, setSelected] = useState(null);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: '이름', accessor: 'name' },
    { Header: '카테고리', accessor: 'category' },
    { Header: 'URL', accessor: 'url'},
    { Header: '생성일', accessor: 'created_at' },
  ], []);

  const detailMetaData = [
    { type: 'map' },
    { title: '이름', label: 'name', type: 'text', isEditable: true },
    { title: '카테고리', label: 'category', type: 'text', isEditable: true },
    { title: 'URL', label: 'url', type: 'text', isEditable: true },
    { title: '생성일', label: 'created_at', type: 'date', isEditable: false },
  ];

  const handleNew = () => {
    setSelected({
      id: null,
      name: '',
      category: '',
      url: '',
    });
  };

  const handleSave = (data) => {
    data.lat = Number(data.lat);
    data.lon = Number(data.lon);
    if (data.id) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const handleUpdate = async (data) => {
    const { id, name, category, lat, lon, url } = data;
    if (!name || !category || !lat || !lon || !url) {
      setToast({ message: '모든 필드를 입력해주세요.', isSuccess: false });
      return;
    }

    try {
      await api.put(`stores/${id}`, { name, category, lat, lon, url});

      setData(prev => ({
        ...prev,
        stores: prev.stores.map(store =>
          store.id === id ? { ...store, name, category, lat, lon, url } : store
        ),
      }));

      setSelected(null);

      setToast({ message: '가게 정보가 업데이트되었습니다.', isSuccess: true });
    } catch (e) {
      setToast(e);
    }
  };

  const handleCreate = async (data) => { 
    const { name, category, lat, lon, url } = data;
    if (!name || !category || !lat || !lon || !url) {
      setToast({ message: '모든 필드를 입력해주세요.', isSuccess: false });
      return;
    }

    try {
      const res = await api.post('stores', { name, category, lat, lon, url });
      const newStore = res.data.store;
      setData(prev => ({
        ...prev,
        stores: [...prev.stores, newStore],
      }));
      setSelected(null);
      setToast({ message: '가게가 생성되었습니다.', isSuccess: true });
    } catch (e) {
      setToast(e);
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`stores/${selected.id}`);

      setData(prev => ({
        ...prev,
        stores: prev.stores.filter(store => store.id !== selected.id),
      }));
      setSelected(null);
      setToast({ message: '가게가 삭제되었습니다.', isSuccess: true });
    } catch (e) {
      setToast(e);
    }
  };

  return (
    <>
      <Header title="가게" onClick={handleNew}/>
      <PageDiv>
        <div style={{ flex: selected ? 4 : 1 }}>
          <Table key="users" columns={columns} data={stores} onRowClick={setSelected} />
        </div>
        {selected &&
          <div flex={3}>
            <DetailBox 
              data={selected} 
              metaData={detailMetaData} 
              onApprove={handleSave}
              approveTitle={selected.id ? '수정하기' : '추가하기'}
              onReject={selected.id ? handleDelete : null}
              rejectTitle='삭제하기'/>
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