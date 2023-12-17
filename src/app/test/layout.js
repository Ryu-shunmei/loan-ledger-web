import Image from "next/image";

export default function DashboardLayout({ children }) {
  return (
    <main className=" w-full h-full">
      <header className="w-full h-[64px] fixed bg-secondary-50">1</header>
      <nav className="fixed w-[64px] h-full shadow-md">
        <div className="w-full h-[64px] flex justify-center items-center">
          <Image width={32} height={32} src="/logos/logo-mini.svg" />
        </div>
        <div className="w-full"></div>
      </nav>
      <section className=" pt-[68px] pl-[68px]">{children}</section>
    </main>
  );
}

// 菜单配置
const navConfig = [{}];
