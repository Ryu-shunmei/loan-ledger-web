"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
//
import CustzBreadcrumbs from "@/components/custz-breadcumbs";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
  Select,
  SelectItem,
  cn,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import myAxios from "@/utils/my-axios";
import { jwtDecode } from "jwt-decode";
import { RolesConfig } from "@/utils/conf";

export default function NewOrg() {
  const router = useRouter();

  const schema = Yup.object().shape({
    last_name: Yup.string().required(),
    first_name: Yup.string().required(),
    email: Yup.string().required(),
    type: Yup.string().required(),
    org_id: Yup.string().required(),
    permission_cases: Yup.array(),
    permission_users: Yup.array(),
    permission_orgs: Yup.array(),
    permission_banks: Yup.array(),
  });

  const defaultValues = {
    last_name: "",
    first_name: "",
    email: "",
    type: "",
    org_id: "",
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
        org_id: data.org_id,
        last_name: data.last_name,
        first_name: data.first_name,
        email: data.email,
        type: data.type,
        role_name: RolesConfig.find((item) => item.id === data.type).name,
        permission_ids: [
          ...data.permission_cases,
          ...data.permission_users,
          ...data.permission_orgs,
          ...data.permission_banks,
        ],
      };
      try {
        await myAxios.post("/user/permissions", sendData);
        router.push(`/dashboard/users`);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [orgOptions, setOrgOpyions] = useState([]);
  const [permissionOptions, setPermissionOpyions] = useState([]);

  const fetchOrgOptions = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/layouts/orgs?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {})).curr_role_id
        }`
      );
      console.log("fetchOrgOptions", response.data);
      setOrgOpyions(response.data);
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
    fetchOrgOptions();
    fetchPemissionOptions();
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
          <div>ユーザー新規</div>
          <div className=" space-x-2">
            <Button
              color="secondary"
              variant="flat"
              onClick={() => router.push("/dashboard/users")}
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
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.last_name && Boolean(formik.errors.last_name)
                }
                errorMessage={
                  formik.touched.last_name && formik.errors.last_name
                }
                color="secondary"
                size="sm"
                label="姓"
                className="min-w-xs"
              />
              <Input
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.first_name && Boolean(formik.errors.first_name)
                }
                errorMessage={
                  formik.touched.first_name && formik.errors.first_name
                }
                color="secondary"
                size="sm"
                label="名"
                className="min-w-xs"
              />
              <Input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={formik.touched.email && Boolean(formik.errors.email)}
                errorMessage={formik.touched.email && formik.errors.email}
                color="secondary"
                size="sm"
                label="Eメール"
                className="min-w-xs"
              />
            </div>

            <div className=" flex flex-row justify-center items-start space-x-4">
              <Select
                name="org_id"
                value={formik.values.org_id}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.org_id && Boolean(formik.errors.org_id)
                }
                errorMessage={formik.touched.org_id && formik.errors.org_id}
                isDisabled={orgOptions.length === 0}
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
              <Select
                name="type"
                onChange={formik.handleChange}
                isInvalid={formik.touched.type && Boolean(formik.errors.type)}
                errorMessage={formik.touched.type && formik.errors.type}
                size="sm"
                color="secondary"
                label="ロールタイプ"
                className="min-w-xs"
              >
                {RolesConfig.filter((i) => !i.id.includes("0")).map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>
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
    </form>
  );
}
