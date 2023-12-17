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
  Card,
  Modal,
  ModalContent,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
//
import myAxios from "@/utils/my-axios";
//
import useTable from "@/hooks/use-table";
import { OrgConfig } from "@/utils/conf";
import { jwtDecode } from "jwt-decode";
import CaseRow from "@/components/case-row";
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

  const fetchCasess = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/cases?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {}))?.curr_role_id
        }`
      );
      console.log("fetchCasess", response.data);
      setTableData(response.data);
    } catch (error) {
      console.error("fetchCasess", error);
    }
  }, []);

  useEffect(() => {
    fetchCasess();
  }, []);
  const open = useBoolean();
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
            placeholder="邸名で検索します"
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
          onClick={() => router.push("/dashboard/cases/new")}
        >
          新規
        </Button>
      </div>
      <div className=" max-h-[calc(100vh_-_140px)] max-w-[calc(100wh_-_96px)] pt-[24px] ">
        <Card className="max-h-[calc(100vh_-_164px)] h-[calc(100vh_-_164px)] max-w-[calc(100wh_-_96px)]  space-y-4 p-2 overflow-y-auto">
          {dataFiltered
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((item) => (
              <CaseRow key={item.id} data={item} />
            ))}
          {dataFiltered.slice(
            table.page * table.rowsPerPage,
            table.page * table.rowsPerPage + table.rowsPerPage
          ).length === 0 && (
            <div className=" w-full h-[200px] text-center mt-20">
              表示できるデータがありません。
            </div>
          )}
        </Card>
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
    inputData = inputData.filter((item) => item.house_name.includes(name));
  }

  return inputData;
}
