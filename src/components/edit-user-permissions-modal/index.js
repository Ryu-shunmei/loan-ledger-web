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

export default function EditPermissionsModal({
  isOpen,
  onClose,
  user_id,
  org_id,
  user_name,
  onOpenChange,
  fetchUserOptions,
}) {
  const schema = Yup.object().shape({
    type: Yup.string().required(),
    permission_cases: Yup.array(),
    permission_users: Yup.array(),
    permission_orgs: Yup.array(),
    permission_banks: Yup.array(),
  });

  const defaultValues = {
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
      console.log(8888, sendData);
      await myAxios.put(
        `/user/permissions?user_id=${user_id}&org_id=${org_id}`,
        sendData
      );
      await fetchUserOptions();
      onOpenChange();
    },
  });

  const fetchPermissionsData = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/user/permissions?user_id=${user_id}&org_id=${org_id}`
      );
      console.log("fetchPermissionsData", response.data);
      formik.setFieldValue(
        "type",
        !!response.data.type ? response.data.type : ""
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
      console.log("fetchPermissionsData", error);
    }
  }, []);

  const [permissionOptions, setPermissionOpyions] = useState([]);

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
    fetchPermissionsData();
    fetchPemissionOptions();
  }, [isOpen]);
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
                name="type"
                value={formik.values.type}
                selectedKeys={!!formik.values.type ? [formik.values.type] : []}
                onChange={formik.handleChange}
                isInvalid={formik.touched.type && Boolean(formik.errors.type)}
                errorMessage={formik.touched.type && formik.errors.type}
                size="sm"
                color="secondary"
                label="ユーザータイプ"
                className="min-w-xs"
              >
                {RolesConfig.filter((item) => !item.id.includes("0")).map(
                  (item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )
                )}
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
