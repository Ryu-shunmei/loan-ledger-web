"use client";
import { Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Image,
  Tooltip,
} from "@nextui-org/react";

// hooks
import { useAuthContext } from "@/hooks/use-auth-context";

import { OrgConfig, RolesConfig } from "@/utils/conf";

const navConfig = [
  {
    title: "案件管理",
    icon: "bi:database",
    path: "/dashboard/cases",
    accessCode: "CASE_01",
  },
  {
    title: "ユーザー管理",
    icon: "bi:people",
    path: "/dashboard/users",
    accessCode: "USER_01",
  },
  {
    title: "組織管理",
    icon: "bi:buildings",
    path: "/dashboard/orgs",
    accessCode: "ORG_01",
  },
  {
    title: "銀行管理",
    icon: "bi:bank",
    path: "/dashboard/banks",
    accessCode: "BANK_01",
  },
];

export default function DashboardLayout({ children }) {
  const curr_path = usePathname();
  const { user, switch_role, logout, hasPermission } = useAuthContext();
  return (
    <Fragment>
      <main className=" flex flex-row justify-start">
        <aside className="min-w-[64px] h-[100vh] bg-white flex flex-col justify-between items-center pb-5 shadow-md">
          <div className="w-[64px] h-[64px] flex justify-center items-center">
            <Image radius="none" width={32} src="/logos/logo-mini.svg" />
          </div>
          <nav className="min-w-[64px] h-[100vh] bg-white flex flex-col justify-start items-center space-y-4 pt-3">
            {navConfig.map(
              (menu) =>
                hasPermission(menu.accessCode) && (
                  <Item
                    key={menu.title}
                    active={curr_path.includes(menu.path)}
                    icon={menu.icon}
                    path={menu.path}
                    title={menu.title}
                  />
                )
            )}
          </nav>
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  radius="sm"
                  className="w-[32px] h-[32px]"
                  color="secondary"
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                />
              </DropdownTrigger>
              <DropdownMenu variant="faded" aria-label="user">
                <DropdownSection title="基本情報" showDivider>
                  <DropdownItem
                    key="userInfo"
                    description={!!user?.email ? user?.email : ""}
                  >
                    {`${user?.last_name} ${user?.first_name}`}
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="ロール情報" showDivider>
                  {user?.roles.map((role) => (
                    <DropdownItem
                      key={role.id}
                      onClick={() => switch_role(user?.id, role?.id)}
                      endContent={
                        role.id === user?.curr_role_id ? (
                          <Icon icon="carbon:checkmark" />
                        ) : (
                          <></>
                        )
                      }
                    >
                      {`${role?.org_name}: ${
                        RolesConfig.find((item) => item.id === role.type)?.name
                      }`}
                    </DropdownItem>
                  ))}
                </DropdownSection>
                <DropdownSection title="基本機能">
                  <DropdownItem
                    key="logout"
                    as={Button}
                    endContent={<Icon icon="bi:arrow-bar-right" />}
                    className="text-left"
                    onClick={logout}
                  >
                    ログアウト
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </aside>

        <section className="w-[calc(100wh_-_-64px)] min-h-[100vh] p-[16px] flex-1">
          {children}
        </section>
      </main>
    </Fragment>
  );
}

// ----------------------------------------------------------------------

function Item({ active, icon, title, path }) {
  const router = useRouter();
  return (
    <Tooltip
      content={
        <div className="px-1 py-1">
          <div className="text-small text-secondary-500">{title}</div>
        </div>
      }
      placement="right"
    >
      <Button
        isIconOnly
        variant={active ? "flat" : "light"}
        color={active ? "secondary" : "default"}
        onClick={() => router.push(path)}
      >
        <Icon
          width={24}
          icon={icon}
          className={active ? "text-purple-600" : "text-gray-500"}
        />
      </Button>
    </Tooltip>
  );
}
