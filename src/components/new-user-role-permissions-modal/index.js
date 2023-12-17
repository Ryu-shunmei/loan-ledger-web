"use client";
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Select,
  SelectItem,
  cn,
} from "@nextui-org/react";
import { useState, useCallback, useEffect } from "react";
import myAxios from "@/utils/my-axios";
import { RolesConfig } from "@/utils/conf";
import { jwtDecode } from "jwt-decode";

export default function NewRoleModal({
  isOpen,
  onClose,
  user_id,
  user_name,
  onOpenChange,
  curr_org,
  fetchUserData,
}) {
  const schema = Yup.object().shape({
    org_id: Yup.string().required(),
    type: Yup.string().required(),
    permission_cases: Yup.array(),
    permission_users: Yup.array(),
    permission_orgs: Yup.array(),
    permission_banks: Yup.array(),
  });

  const defaultValues = {
    org_id: "",
    type: "",
    permission_cases: [],
    permission_users: [],
    permission_orgs: [],
    permission_banks: [],
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (data) => {
      let role = RolesConfig.find((item) => item.id === data.type);
      const sendData = {
        ...data,
        role_name: role?.name,
        permission_ids: [
          ...data.permission_cases,
          ...data.permission_users,
          ...data.permission_orgs,
          ...data.permission_banks,
        ],
      };
      console.log(sendData);
      await myAxios.post(`/user/role/permissions?user_id=${user_id}`, sendData);
      await fetchUserData();
      onOpenChange();
    },
  });

  const [permissionOptions, setPermissionOpyions] = useState([]);
  const [orgOptions, setOrgOpyions] = useState([]);

  const fetchPemissionOptions = useCallback(async () => {
    try {
      const response = await myAxios.get("/layouts/permissions");
      console.log("fetchPemissionOptions", response.data);
      setPermissionOpyions(response.data);
    } catch (error) {
      console.log("fetchPemissionOptions", error);
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
      setOrgOpyions(response.data);
    } catch (error) {
      console.log("fetchOrgOptions", error);
    }
  }, []);

  useEffect(() => {
    fetchOrgOptions();
    fetchPemissionOptions();
    formik.setValues(defaultValues);
  }, []);
  const parsePermissionID = (accessName) => {
    const target = permissionOptions.find((item) => item.name === accessName);
    return target?.id;
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader className="flex flex-col gap-1 text-secondary-600">
            {user_name}
          </ModalHeader>
          <ModalBody>
            <div className=" space-y-2">
              <div className="text-secondary-600">権限設定</div>
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
                {orgOptions
                  .filter((item) => !curr_org.find((i) => i.org_id === item.id))
                  .map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
              </Select>
              <Select
                name="type"
                value={formik.values.type}
                selectedKeys={!!formik.values.type ? [formik.values.type] : []}
                onChange={formik.handleChange}
                isInvalid={formik.touched.type && Boolean(formik.errors.type)}
                errorMessage={formik.touched.type && formik.errors.type}
                size="sm"
                color="secondary"
                label="ロールタイプ"
                className="min-w-xs"
              >
                {RolesConfig.filter(
                  (item) => !item.id.includes("0") && item.id
                ).map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select>
              <div className=" space-y-4  ">
                <div className=" space-y-3">
                  <div className="text-[14px] pl-[6px]">案件管理</div>
                  <CheckboxGroup
                    onChange={(values) =>
                      formik.setFieldValue("permission_cases", values)
                    }
                    value={formik.values.permission_cases}
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
                    value={formik.values.permission_users}
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
                    value={formik.values.permission_orgs}
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
                    value={formik.values.permission_banks}
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
            <Divider />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" variant="flat" onPress={onClose}>
              戻る
            </Button>
            <Button color="secondary" variant="solid" type="submit">
              確認
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
