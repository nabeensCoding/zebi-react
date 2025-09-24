import { useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import imageCompression from 'browser-image-compression';

import Header from '../../components/Header';
import Table from '../../components/Table';
import DetailBox from '../../components/DetailBox';
import api from '../../api/api';

export default function PartnersPage() {
  const { partners, setData, setToast } = useOutletContext();
  const [selected, setSelected] = useState(null);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: '이름', accessor: 'name' },
    { Header: '이미지', 
      accessor: 'image',
      Cell: ({ value }) => (
        <img src={value} alt="Partner" style={{ width: '50px', height: '50px', borderRadius: '12px' }} />
      )
    },
    { Header: '생성일', accessor: 'created_at' },
  ], []);

  const detailMetaData = [
    { title: '이름', label: 'name', type: 'text', isEditable: true },
    { title: '이미지', label: 'image', type: 'image', isEditable: true },
    { title: '생성일', label: 'created_at', type: 'date', isEditable: false },
  ];

  const handleNew = () => {
    setSelected({
      id: null,
      name: '',
      image: null,
      created_at: '',
    });
  };

  const handleSave = (data) => {
    console.log(data);
    if (data.id) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const handleCreate = async (data) => {
    const { name, image } = data;

    if (!name || !image || !(image instanceof File)) {
      setToast({ message: '이름과 이미지를 올려주세요.', isSuccess: false });
      return;
    }

    try {
      // 이미지 압축
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(image, options);

      const form = new FormData();
      form.append('name', name);
      form.append('image', compressedFile);

      const res = await api.post('partners', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newPartner = res.data.partner;

      setData(prev => ({
        ...prev,
        partners: [...prev.partners, newPartner],
      }));

      setToast({ message: '단과대가 추가되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast({ message: e || '추가 중 오류 발생', isSuccess: false });
    }
  };

  const handleUpdate = async (data) => {
    const { id, name, image } = data;

    if (!id || !name) {
      setToast({ message: '이름을 입력해주세요.', isSuccess: false });
      return;
    }

    try {
      const form = new FormData();
      form.append('name', name);

      if (image instanceof File) {
        // 이미지 압축
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(image, options);
        
        form.append('image', compressedFile);
      }

      const res = await api.put(`partners/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = res.data.partner;

      setData(prev => ({
        ...prev,
        partners: prev.partners.map(p => p.id === id ? updated : p),
      }));

      setToast({ message: '단과대 정보가 업데이트되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast({ message: e.message || '업데이트 중 오류 발생', isSuccess: false });
    }
  };

  const handleDelete = async (data) => {
    if (!data.id) return;

    try {
      await api.delete(`partners/${data.id}`);

      setData(prev => ({
        ...prev,
        partners: prev.partners.filter(p => p.id !== data.id),
      }));

      setToast({ message: '단과대가 삭제되었습니다.', isSuccess: true });
      setSelected(null);
    } catch (e) {
      setToast({ message: e.message || '삭제 중 오류 발생', isSuccess: false });
    }
  };

  return (
    <>
      <Header title="단과대" onClick={handleNew}/>
      <PageDiv>
        <div style={{ flex: selected ? 4 : 1 }}>
          <Table key="users" columns={columns} data={partners} onRowClick={setSelected} />
        </div>
        {selected &&
          <div flex={3} style={{height: '100px'}}>
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