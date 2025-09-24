import { useState } from 'react';
import styled from '@emotion/styled';

export default function SearchableSelect({ value, onChange, options = [] }) {
  const [search, setSearch] = useState('');

  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
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
            onClick={() => handleSelect(option.value)}
            selected={option.value === value}
          >
            {option.label}
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
  background-color: ${({ selected }) => (selected ? '#e6f3ff' : 'white')};

  &:hover {
    background-color: #d0e7ff;
  }
`;

const EmptyMessage = styled.li`
  padding: 8px 12px;
  color: #888;
`;
