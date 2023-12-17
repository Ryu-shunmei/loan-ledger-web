"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
//
import CustzBreadcrumbs from "@/components/custz-breadcumbs";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CheckboxGroup,
  Divider,
  Input,
} from "@nextui-org/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import myAxios from "@/utils/my-axios";
import { jwtDecode } from "jwt-decode";
import { RolesConfig, OrgConfig } from "@/utils/conf";
import { Icon } from "@iconify/react";
import { CustzCheckboxUserRole } from "@/components/custz-checkbox";
import { useBoolean } from "@/hooks/use-boolean";
import NewRoleModal from "@/components/new-user-role-permissions-modal";

export default function NewOrg() {
  const router = useRouter();
  const search = useSearchParams();
  const schema = Yup.object().shape({
    last_name: Yup.string().required(),
    first_name: Yup.string().required(),
    email: Yup.string().required(),
  });

  const defaultValues = {
    last_name: "",
    first_name: "",
    email: "",
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (data) => {
      console.log(data);
      const sendData = {
        last_name: data.last_name,
        first_name: data.first_name,
        email: data.email,
      };
      try {
        await myAxios.put(`/user/basic/${search.get("user_id")}`, sendData);
        await fetchUserData();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [roleData, setRoleData] = useState([]);
  const [deleteRoles, setDeleteRoles] = useState([]);
  const showNewRole = useBoolean();
  const fetchUserData = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/user/role/permissions?user_id=${search.get("user_id")}`
      );
      console.log("fetchUserData", response.data);
      formik.setFieldValue("last_name", response.data.last_name);
      formik.setFieldValue("first_name", response.data.first_name);
      formik.setFieldValue("email", response.data.email);
      setRoleData(response.data.roles);
    } catch (error) {
      console.log("fetchUserData", error);
    }
  }, []);

  const handleDeleteRoles = useCallback(async () => {
    try {
      await myAxios.put(`/user/roles/${search.get("user_id")}`, {
        org_ids: deleteRoles,
      });
      fetchUserData();
      setDeleteRoles([]);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Fragment>
      <div className="h-[44px] w-full flex flex-col justify-between items-start  ">
        <CustzBreadcrumbs />
      </div>
      <Card
        shadow="sm"
        className="min-h-[calc(100vh_-_76px)] max-w-[calc(100wh_-_96px)]  space-y-4"
      >
        <CardHeader className="text-secondary-600 flex flex-row justify-between">
          <div>ユーザー編集</div>
          <div className=" space-x-2">
            <Button
              color="secondary"
              variant="solid"
              onClick={() => router.push("/dashboard/users")}
            >
              ユーザー管理に戻る
            </Button>
          </div>
        </CardHeader>
        <Divider />

        <CardBody className="flex flex-row justify-between space-x-2">
          <form
            className="w-[50%] min-h-[calc(100vh_-_196px)]"
            onSubmit={formik.handleSubmit}
          >
            <Card className="w-full min-h-[calc(100vh_-_196px)]">
              <CardHeader className="h-[72px]">
                <div className="text-[18px] text-secondary-600">基本情報</div>
              </CardHeader>
              <CardBody className=" flex flex-col justify-start space-y-2">
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
                  size="lg"
                  label="姓"
                  className="min-w-xs"
                />
                <Input
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.first_name &&
                    Boolean(formik.errors.first_name)
                  }
                  errorMessage={
                    formik.touched.first_name && formik.errors.first_name
                  }
                  color="secondary"
                  size="lg"
                  label="名"
                  className="min-w-xs"
                />
                <Input
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.email && Boolean(formik.errors.email)
                  }
                  errorMessage={formik.touched.email && formik.errors.email}
                  color="secondary"
                  size="lg"
                  label="Eメール"
                  className="min-w-xs"
                />
              </CardBody>
              <CardFooter>
                <Button
                  fullWidth
                  color="secondary"
                  variant="flat"
                  type="submit"
                >
                  保存
                </Button>
              </CardFooter>
            </Card>
          </form>
          <Card className="w-[50%] min-h-[calc(100vh_-_196px)]">
            <CardHeader className=" flex flex-row justify-between h-[72px]">
              <div className=" text-[18px] text-danger-600">
                {`ロール（${roleData.length}）`}
              </div>
              <Button
                color="danger"
                variant="flat"
                onClick={showNewRole.onTrue}
              >
                ロール新規
              </Button>
            </CardHeader>
            <CardBody>
              <CheckboxGroup
                value={deleteRoles}
                onChange={(values) => setDeleteRoles(values)}
                classNames={{
                  base: "w-full",
                }}
              >
                {roleData.map((role) => (
                  <CustzCheckboxUserRole
                    key={role.role_id}
                    role={role}
                    user_name={`${formik.values.last_name} ${formik.values.first_name}`}
                    user_id={search.get("user_id")}
                    fetchUserData={fetchUserData}
                  />
                ))}
              </CheckboxGroup>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                color="danger"
                variant="flat"
                isDisabled={deleteRoles.length === 0}
                onClick={() => handleDeleteRoles()}
              >
                <div className=" w-full flex flex-row justify-between items-center">
                  <div className="w-[30%] text-start">
                    {deleteRoles.length} 選択された
                  </div>
                  <div className="w-[30%]">ユーザーから取除</div>
                  <div className="w-[30%] text-end"></div>
                  <Icon width={16} icon="bi:chevron-double-right" />
                </div>
              </Button>
            </CardFooter>
          </Card>
        </CardBody>
      </Card>
      {showNewRole.value && (
        <NewRoleModal
          isOpen={showNewRole.value}
          onClose={showNewRole.onFalse}
          onOpenChange={showNewRole.onToggle}
          user_id={search.get("user_id")}
          user_name={`${formik.values.last_name} ${formik.values.first_name}`}
          curr_org={roleData}
          fetchUserData={fetchUserData}
        />
      )}
    </Fragment>
  );
}
