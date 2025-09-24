import styled from "@emotion/styled";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <SidebarDiv>
      <Title>빈자리닷 대시보드</Title>
      <SidebarItem to="/users" icon="👤" label="사용자" />
      <SidebarItem to="/college-auth" icon="🏫" label="단과대 인증" />
      <SidebarItem to="/stores" icon="🏪" label="가게" />
      <SidebarItem to="/partners" icon="🎓" label="단과대" />
      <SidebarItem to="/partnerships" icon="🤝" label="제휴" />
    </SidebarDiv>
  );
}

const SidebarDiv = styled.nav`
  width: 220px;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 64px;
  font-weight: bold;
  color: #333;
`;