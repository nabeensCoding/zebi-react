import styled from '@emotion/styled';

export default function Header({ title, onClick }) {
  return (
    <HeaderDiv>
      <HeaderTitle>{title}</HeaderTitle>
      {onClick && <ButtonDiv><HeaderButton onClick={onClick}>새로 만들기</HeaderButton></ButtonDiv>}
    </HeaderDiv>
  )
}

const HeaderDiv = styled.div`
  padding: 10px 0px;
`;

const HeaderTitle = styled.h1`
  color: #333;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const HeaderButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;