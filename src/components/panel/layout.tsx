import FooterPanel from './footer';
import HeadPanel from './head';
import SidebarPanel from './sidebar';

export default function LayoutPanel({ children , props }) {

  return (
    <>

      <HeadPanel />
      <SidebarPanel props={props}>{children}</SidebarPanel>
      <FooterPanel />

    </>
  );
}