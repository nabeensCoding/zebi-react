import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

export default function SidebarItem({ to, icon, label }) {
  return (
    <SidebarItemDiv to={to}>
      <Emoji>{icon}</Emoji>
      <Label>{label}</Label>
      <Arrow>❯</Arrow>
    </SidebarItemDiv>
  );
}

const SidebarItemDiv = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  margin-bottom: 8px;
  border-radius: 10px;
  background-color: #f2f2f2;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
  &:hover {
    background-color: #b6e3ff;
  }
  &.active {
    background-color: #007bff;
    color: #fff;
  }
`;

const Emoji = styled.span`
`;
const Label = styled.span`
  margin: 0 12px;
  font-weight: bold;
`;

const Arrow = styled.span`
  font-size: 14px;
`;