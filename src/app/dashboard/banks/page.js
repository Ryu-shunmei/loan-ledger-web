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
import NewBankModal from "@/components/new-bank-modal";
import { useBoolean } from "@/hooks/use-boolean";
import EditBankModal from "@/components/edit-bank-modal";
// ----------------------------------------------------------------------
const defaultFilters = {
  name: "",
};

// ----------------------------------------------------------------------
export default function Page() {
  const table = useTable();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const newBank = useBoolean();
  const editBank = useBoolean();
  const [editBankItem, setEditBankItem] = useState({
    id: "",
    name: "",
    type: "",
  });
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

  const fetchBanks = useCallback(async () => {
    try {
      const response = await myAxios.get("/banks");
      console.log("fetchOrgs", response.data);
      setTableData(response.data);
    } catch (error) {
      console.error("fetchOrgs", error);
    }
  }, []);

  useEffect(() => {
    fetchBanks();
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
            placeholder="銀行名称で検索します"
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
          onClick={newBank.onTrue}
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
              名称
            </TableColumn>
            <TableColumn align="start" key="type">
              提携種別
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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip size="sm">{item.type}</Chip>
                  </TableCell>

                  <TableCell>
                    <div className="relative flex justify-end items-center gap-2">
                      <Button
                        size="sm"
                        radius="sm"
                        variant="flat"
                        color="secondary"
                        onClick={() => {
                          setEditBankItem(item);
                          editBank.onTrue();
                        }}
                      >
                        銀行編集
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <NewBankModal
        isOpen={newBank.value}
        onClose={newBank.onFalse}
        onOpenChange={newBank.onToggle}
        fetchBanks={fetchBanks}
      />
      {editBank.value && (
        <EditBankModal
          isOpen={editBank.value}
          onClose={editBank.onFalse}
          onOpenChange={editBank.onToggle}
          id={editBankItem?.id}
          name={editBankItem?.name}
          type={editBankItem?.type}
          fetchBanks={fetchBanks}
        />
      )}
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
    inputData = inputData.filter((item) => item.name.includes(name));
  }

  return inputData;
}
