"use client";
import { Fragment, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
// components
import CustzBreadcrumbs from "@/components/custz-breadcumbs";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
//
import myAxios from "@/utils/my-axios";
//
import useTable from "@/hooks/use-table";
import { RolesConfig } from "@/utils/conf";
import { jwtDecode } from "jwt-decode";
import { useBoolean } from "@/hooks/use-boolean";

// ----------------------------------------------------------------------
const defaultFilters = {
  name: "",
};

// ----------------------------------------------------------------------
export default function Page() {
  const router = useRouter();
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: table.getComparator(table.order, table.orderBy),
    filters,
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/users?user_id=${
          jwtDecode(localStorage.getItem("accessToken", {}))?.id
        }&role_id=${
          jwtDecode(localStorage.getItem("accessToken", {}))?.curr_role_id
        }&is_super=${
          jwtDecode(localStorage.getItem("accessToken", {})).is_super
        }`
      );
      console.log("fetchUsers", response.data);
      setTableData(response.data);
    } catch (error) {
      console.error("fetchUsers", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Fragment>
      <div className="h-[44px] w-full flex flex-col justify-between items-start  ">
        <CustzBreadcrumbs />
      </div>
      <div className="h-[64px] w-full flex flex-row justify-between items-end">
        <div className=" flex flex-row justify-start items-end space-x-2 flex-1">
          <Input
            size="sm"
            label="検索"
            color="secondary"
            isClearable={true}
            onClear={() => {}}
            placeholder="姓称で検索します"
            startContent={
              <Icon width={14} className="mb-0.5 " icon="bi:search" />
            }
            className="max-w-xs"
            classNames={{
              label: "text-black/50 dark:text-white/90",
            }}
            onChange={(e) => handleFilters("name", e.target.value)}
          />
        </div>
        <Button
          color="secondary"
          endContent={<Icon icon="bi:plus-lg" />}
          onClick={() => router.push("/dashboard/users/new")}
        >
          新規
        </Button>
      </div>
      <div className=" max-h-[calc(100vh_-_140px)] max-w-[calc(100wh_-_96px)] pt-[24px] ">
        <Table
          aria-label="組織"
          bottomContent={
            Math.ceil(tableData.length / table.rowsPerPage) > 1 && (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={table.page}
                  total={Math.ceil(tableData.length / table.rowsPerPage)}
                  onChange={(page) => table.setPage(page)}
                />
              </div>
            )
          }
          classNames={{
            wrapper: "h-[calc(100vh_-_164px)] m-0",
          }}
        >
          <TableHeader>
            <TableColumn align="start" key="name">
              姓称
            </TableColumn>
            <TableColumn align="start" key="email">
              Eメール
            </TableColumn>
            <TableColumn align="start" key="roles">
              複数ロール
            </TableColumn>
            <TableColumn align="end" key="actions">
              <div className="relative flex justify-end items-center gap-2">
                <Button
                  isIconOnly
                  isDisabled
                  radius="sm"
                  size="sm"
                  variant="light"
                >
                  <Icon
                    width={20}
                    icon="charm:menu-kebab"
                    className="text-default-400"
                  />
                </Button>
              </div>
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"表示できるデータがありません。"}>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{`${item.last_name} ${item.first_name}`}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell className="flex flex-wrap justify-start">
                    {item.roles.map((role) => (
                      <Chip
                        key={role.role_id}
                        size="sm"
                        radius="full"
                        className=" m-1 h-[18px] text-[9px]"
                      >
                        {role.org_name}:
                        {RolesConfig.find((i) => i.id === role.role_type)?.name}
                      </Chip>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="relative flex justify-end items-center gap-2">
                      <Button
                        size="sm"
                        radius="sm"
                        variant="flat"
                        color="secondary"
                        onClick={() =>
                          router.push(
                            `/dashboard/users/edit?user_id=${item?.id}`
                          )
                        }
                      >
                        組織編集
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((item) => {
      const user_name = `${item.last_name}${item.first_name}`;
      return user_name.includes(name);
    });
  }

  return inputData;
}
