"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
//
import CustzBreadcrumbs from "@/components/custz-breadcumbs";
import NewUserModal from "@/components/new-user-modal";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
  cn,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import { OrgConfig } from "@/utils/conf";
import myAxios from "@/utils/my-axios";
import { jwtDecode } from "jwt-decode";

const orgConfig = { "01": "本社", "02": "エリア", "03": "支店" };

export default function NewOrg() {
  const router = useRouter();
  const search = useSearchParams();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const schema = Yup.object().shape({
    p_id: Yup.string(),
    name: Yup.string().required(),
    type: Yup.string().required(),
    user_id: Yup.string().required(),
    permission_cases: Yup.array(),
    permission_users: Yup.array(),
    permission_orgs: Yup.array(),
    permission_banks: Yup.array(),
  });

  const defaultValues = {
    p_id: "",
    name: "",
    type: "",
    user_id: "",
    permission_cases: [],
    permission_users: [],
    permission_orgs: [],
    permission_banks: [],
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (data) => {
      console.log(data);
      const sendData = {
        p_id: data.p_id,
        name: data.name,
        type: data.type,
        user_id: data.user_id,
        role_name: `${orgConfig[data.type]}管理者`,
        permission_ids: [
          ...data.permission_cases,
          ...data.permission_users,
          ...data.permission_orgs,
          ...data.permission_banks,
        ],
      };
      try {
        await myAxios.put(`/org/${search.get("org_id")}`, sendData);
        router.push("/dashboard/orgs");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const fetchOrgData = useCallback(async () => {
    try {
      const response = await myAxios.get(`/org/${search.get("org_id")}`);
      console.log("fetchOrgData", response.data);
      formik.setFieldValue(
        "p_id",
        !!response.data.p_id ? response.data.p_id : ""
      );
      formik.setFieldValue(
        "name",
        !!response.data.name ? response.data.name : ""
      );
      formik.setFieldValue(
        "type",
        !!response.data.type ? response.data.type : ""
      );
      formik.setFieldValue(
        "user_id",
        !!response.data.user_id ? response.data.user_id : ""
      );
      const permission_cases = [];
      const permission_users = [];
      const permission_orgs = [];
      const permission_banks = [];
      response.data.permissions.forEach((permission) => {
        if (
          [
            "案件検索",
            "案件更新",
            "案件新規",
            "案件インポート",
            "案件エクスポート",
          ].includes(permission.name)
        ) {
          permission_cases.push(permission.id);
        }
        if (
          ["ユーザー検索", "ユーザー更新", "ユーザー新規"].includes(
            permission.name
          )
        ) {
          permission_users.push(permission.id);
        }
        if (["組織検索", "組織更新", "組織新規"].includes(permission.name)) {
          permission_orgs.push(permission.id);
        }
        if (["銀行検索", "銀行更新", "銀行新規"].includes(permission.name)) {
          permission_banks.push(permission.id);
        }
      });
      formik.setFieldValue("permission_cases", permission_cases);
      formik.setFieldValue("permission_users", permission_users);
      formik.setFieldValue("permission_orgs", permission_orgs);
      formik.setFieldValue("permission_banks", permission_banks);
    } catch (error) {
      console.log("fetchOrgData", error);
    }
  }, []);

  const setUserIdFeild = async (value) => {
    await fetchUserOptions();
    formik.setFieldValue("user_id", `${value}`);
  };

  const [userOptions, setUserOpyions] = useState([]);
  const [orgOptions, setOrgOpyions] = useState([]);
  const [permissionOptions, setPermissionOpyions] = useState([]);

  const fetchUserOptions = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/layouts/users?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {})).curr_role_id
        }`
      );
      console.log("fetchUserOptions", response.data);
      setUserOpyions(response.data);
    } catch (error) {
      console.log("fetchUserOptions", error);
    }
  }, []);

  const fetchOrgOptions = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/layouts/orgs?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {})).curr_role_id
        }`
      );
      console.log("fetchOrgOptions", response.data);
      setOrgOpyions(
        response.data.filter((option) => option.id !== search.get("org_id"))
      );
    } catch (error) {
      console.log("fetchOrgOptions", error);
    }
  }, []);

  const fetchPemissionOptions = useCallback(async () => {
    try {
      const response = await myAxios.get("/layouts/permissions");
      console.log("fetchPemissionOptions", response.data);
      setPermissionOpyions(response.data);
    } catch (error) {
      console.log("fetchPemissionOptions", error);
    }
  }, []);

  useEffect(() => {
    fetchOrgData();
    fetchOrgOptions();
    fetchUserOptions();
    fetchPemissionOptions();
    console.log(formik.values.permission_cases);
  }, []);
  const parsePermissionID = (accessName) => {
    const target = permissionOptions.find((item) => item.name === accessName);
    return target?.id;
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="h-[44px] w-full flex flex-col justify-between items-start  ">
        <CustzBreadcrumbs />
      </div>
      <Card
        shadow="sm"
        className="min-h-[calc(100vh_-_76px)] max-w-[calc(100wh_-_96px)]  space-y-4"
      >
        <CardHeader className="text-secondary-600 flex flex-row justify-between">
          <div>組織編集</div>
          <div className=" space-x-2">
            <Button
              color="secondary"
              variant="flat"
              onClick={() => router.push("/dashboard/orgs")}
            >
              戻る
            </Button>
            <Button color="secondary" variant="solid" type="submit">
              確認
            </Button>
          </div>
        </CardHeader>
        <Divider />

        <CardBody className=" space-y-6">
          <div className=" space-y-4">
            <div className="text-secondary-600">基本情報</div>
            <div className=" flex flex-row justify-center items-start space-x-4">
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                isInvalid={formik.touched.name && Boolean(formik.errors.name)}
                errorMessage={formik.touched.name && formik.errors.name}
                color="secondary"
                size="sm"
                label="組織名称"
                className="min-w-xs"
              />
              <Select
                name="type"
                onChange={formik.handleChange}
                isInvalid={formik.touched.type && Boolean(formik.errors.type)}
                errorMessage={formik.touched.type && formik.errors.type}
                selectedKeys={!!formik.values.type ? [formik.values.type] : []}
                size="sm"
                color="secondary"
                label="組織タイプ"
                className="min-w-xs"
              >
                {OrgConfig.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                name="p_id"
                value={formik.values.p_id}
                onChange={formik.handleChange}
                isInvalid={formik.touched.p_id && Boolean(formik.errors.p_id)}
                errorMessage={formik.touched.p_id && formik.errors.p_id}
                isDisabled={orgOptions.length === 0}
                selectedKeys={!!formik.values.p_id ? [formik.values.p_id] : []}
                size="sm"
                color="secondary"
                label="所属組織"
                className="min-w-xs"
              >
                {orgOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className=" flex flex-row justify-center items-start space-x-4">
              <Select
                name="user_id"
                value={formik.values.user_id}
                onChange={(e) =>
                  formik.setFieldValue(
                    e.target.name,
                    e.target.value.replace("$.", "")
                  )
                }
                selectedKeys={
                  !!formik.values.user_id ? [formik.values.user_id] : []
                }
                isInvalid={
                  formik.touched.user_id && Boolean(formik.errors.user_id)
                }
                errorMessage={formik.touched.user_id && formik.errors.user_id}
                isDisabled={userOptions.length === 0}
                size="sm"
                color="secondary"
                label="組織管理者"
              >
                {userOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {`${option.last_name} ${option.first_name}`}
                  </SelectItem>
                ))}
              </Select>

              <Tooltip
                content={
                  <div className="px-1 py-1">
                    <div className="text-small text-secondary-500">
                      新規ユーザー
                    </div>
                  </div>
                }
                placement="bottom-end"
              >
                <Button
                  color="secondary"
                  radius="sm"
                  variant="flat"
                  isIconOnly
                  className=" h-[48px] min-w-[48px]"
                  onPress={onOpen}
                >
                  <Icon width={24} icon="bi:plus-lg" />
                </Button>
              </Tooltip>
            </div>
          </div>
          <Divider />
          <div className=" space-y-2">
            <div className="text-secondary-600">権限設定</div>
            <div className=" space-y-4  ">
              <div className=" space-y-3">
                <div className="text-[14px] pl-[6px]">案件管理</div>
                <CheckboxGroup
                  onChange={(values) =>
                    formik.setFieldValue("permission_cases", values)
                  }
                  size="sm"
                  color="secondary"
                  orientation="horizontal"
                  value={formik.values.permission_cases}
                >
                  {[
                    "案件検索",
                    "案件更新",
                    "案件新規",
                    "案件インポート",
                    "案件エクスポート",
                  ].map((item) => (
                    <Checkbox
                      key={item}
                      classNames={{
                        base: cn(
                          "inline-flex w-full",
                          "bg-secondary-50 items-center justify-start ",
                          "cursor-pointer rounded-md ml-[6px]"
                        ),
                      }}
                      value={parsePermissionID(item)}
                    >
                      {item}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <div className=" space-y-3">
                <div className="text-[14px] pl-[6px]">ユーザー管理</div>
                <CheckboxGroup
                  onChange={(values) =>
                    formik.setFieldValue("permission_users", values)
                  }
                  size="sm"
                  color="secondary"
                  orientation="horizontal"
                  value={formik.values.permission_users}
                >
                  {["ユーザー検索", "ユーザー更新", "ユーザー新規"].map(
                    (item) => (
                      <Checkbox
                        key={item}
                        classNames={{
                          base: cn(
                            "inline-flex w-full",
                            "bg-secondary-50 items-center justify-start ",
                            "cursor-pointer rounded-md ml-[6px]"
                          ),
                        }}
                        value={parsePermissionID(item)}
                      >
                        {item}
                      </Checkbox>
                    )
                  )}
                </CheckboxGroup>
              </div>
              <div className=" space-y-3">
                <div className="text-[14px] pl-[6px]">組織管理</div>
                <CheckboxGroup
                  onChange={(values) =>
                    formik.setFieldValue("permission_orgs", values)
                  }
                  size="sm"
                  color="secondary"
                  orientation="horizontal"
                  value={formik.values.permission_orgs}
                >
                  {["組織検索", "組織更新", "組織新規"].map((item) => (
                    <Checkbox
                      key={item}
                      classNames={{
                        base: cn(
                          "inline-flex w-full",
                          "bg-secondary-50 items-center justify-start ",
                          "cursor-pointer rounded-md ml-[6px]"
                        ),
                      }}
                      value={parsePermissionID(item)}
                    >
                      {item}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <div className=" space-y-3">
                <div className="text-[14px] pl-[6px]">銀行管理</div>
                <CheckboxGroup
                  onChange={(values) =>
                    formik.setFieldValue("permission_banks", values)
                  }
                  size="sm"
                  color="secondary"
                  orientation="horizontal"
                  value={formik.values.permission_banks}
                >
                  {["銀行検索", "銀行更新", "銀行新規"].map((item) => (
                    <Checkbox
                      key={item}
                      classNames={{
                        base: cn(
                          "inline-flex w-full",
                          "bg-secondary-50 items-center justify-start ",
                          "cursor-pointer rounded-md ml-[6px]"
                        ),
                      }}
                      value={parsePermissionID(item)}
                    >
                      {item}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <NewUserModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        setUserIdFeild={setUserIdFeild}
      />
    </form>
  );
}
