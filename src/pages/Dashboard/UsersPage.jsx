import { useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import Header from '../../components/Header';
import Table from '../../components/Table';
import DetailBox from '../../components/DetailBox';

export default function UserPage() {
  const { users, partners } = useOutletContext();
  const [selected, setSelected] = useState(null);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: '이름', accessor: 'name' },
    { Header: '전화번호', accessor: 'phone' },
    {
      Header: '인증된 단과대',
      accessor: 'college_auth',
      Cell: ({ row }) => {
        const ids = row.original.college_auth || [];
        const names = ids
          .map(id => {
            const partner = partners.find(c => c.id === id);
            return partner ? partner.name : null;
          })
          .filter(Boolean); // null 제외


        return names.length > 0 ? names.join(', ') : '알 수 없음';
      }
    },
    { Header: '가입일', accessor: 'created_at' },
  ], []);

  const detailMetaData = [
    { title: '이름', label: 'name', type: 'text', isEditable: false },
    { title: '전화번호', label: 'phone', type: 'text', isEditable: false },
    { title: '이미지', label: 'image', type: 'image', isEditable: false },
    { title: '인증여부', label: 'is_verified', type: 'boolean', isEditable: false },
    { title: '가입일', label: 'created_at', type: 'date', isEditable: false },
  ];

  return (
    <>
      <Header title="사용자" />
      <PageDiv>
        <div style={{ flex: selected ? 4 : 1 }}>
          <Table key="users" columns={columns} data={users} onRowClick={setSelected} />
        </div>
        {selected && <div flex={3}><DetailBox data={selected} metaData={detailMetaData} /></div>}
      </PageDiv>
    </>
  )
}

const PageDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;