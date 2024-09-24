import MenuList from "@/components/Menu";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="layout">
      {children}
      <MenuList />
    </div>
  );
};

export default Layout;
