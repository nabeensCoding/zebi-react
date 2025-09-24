import { useState } from 'react';
import styled from '@emotion/styled';

export default function MultiSearchableSelect({ value = [], onChange, options = [] }) {
  const [search, setSearch] = useState('');

  // 검색어 포함하는 옵션 필터링
  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // 아이템 클릭 시 선택 또는 해제
  const handleToggle = (val) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val)); // 해제
    } else {
      onChange([...value, val]); // 추가
    }
  };

  return (
    <Container>
      <SearchInput
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="검색..."
      />
      <List>
        {filtered.map(option => (
          <ListItem
            key={option.value}
            onClick={() => handleToggle(option.value)}
            selected={value.includes(option.value)}
          >
            {option.label}
            {value.includes(option.value) && <CheckMark>✓</CheckMark>}
          </ListItem>
        ))}
        {filtered.length === 0 && (
          <EmptyMessage>검색 결과 없음</EmptyMessage>
        )}
      </List>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 4px;
`;

const List = styled.ul`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background: #fff;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ selected }) => (selected ? '#e6f3ff' : 'white')};

  &:hover {
    background-color: #d0e7ff;
  }
`;

const CheckMark = styled.span`
  color: #007aff;
  font-weight: bold;
`;

const EmptyMessage = styled.li`
  padding: 8px 12px;
  color: #888;
`;
