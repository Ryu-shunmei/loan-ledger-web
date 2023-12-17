"use client";
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
  CheckboxGroup,
  Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Fragment, useCallback, useEffect, useState } from "react";

import {
  CustzCheckboxOtherUser,
  CustzCheckboxOrgUser,
} from "@/components/custz-checkbox";

import myAxios from "@/utils/my-axios";
import { useBoolean } from "@/hooks/use-boolean";
import { jwtDecode } from "jwt-decode";

export default function NewOrg() {
  const router = useRouter();
  const search = useSearchParams();

  const userModal = useBoolean();

  const [orgData, setOrgData] = useState({});
  const fetchOrgData = useCallback(async () => {
    try {
      const response = await myAxios.get(`/org/${search.get("org_id")}`);
      console.log("fetchOrgData", response.data);
      setOrgData(response.data);
    } catch (error) {
      console.log("fetchOrgData", error);
    }
  }, []);

  const [orgUsers, setOrgUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [deleteUsers, setDeleteUsers] = useState([]);
  const [addUsers, setAddUsers] = useState([]);
  const [permissions, setPermissions] = useState({});

  const setUserIdFeild = async (value) => {
    await fetchUserOptions();
    setAddUsers([...addUsers, value]);
  };

  const fetchUserOptions = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/layouts/org/users?org_id=${search.get("org_id")}&role_id=${
          jwtDecode(localStorage.getItem("accessToken", {})).curr_role_id
        }`
      );
      console.log("fetchUserOptions", response.data);

      setOrgUsers(response.data.org_users);
      setOtherUsers(response.data.other_users);
    } catch (error) {
      console.log("fetchUserOptions", error);
    }
  }, []);

  const handleAddusers = useCallback(async () => {
    console.log({
      user_ids: addUsers,
      permissions: permissions,
    });
    try {
      await myAxios.post(`/org/users/${search.get("org_id")}`, {
        user_ids: addUsers,
        permissions: permissions,
      });
      await fetchUserOptions();
      setDeleteUsers([]);
      setAddUsers([]);
    } catch (error) {
      console.log(error);
    }
  });

  const handleDeleteusers = useCallback(async () => {
    console.log(999, {
      user_ids: deleteUsers,
    });
    try {
      await myAxios.put(`/org/users/${search.get("org_id")}`, {
        user_ids: deleteUsers,
      });
      fetchUserOptions();
      setDeleteUsers([]);
      setAddUsers([]);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    fetchOrgData();
    fetchUserOptions();
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
          <div>{`「${orgData?.name}」組織メンバー管理`}</div>
          <div className=" space-x-2">
            <Button
              color="secondary"
              onClick={() => router.push("/dashboard/orgs")}
            >
              組織管理
            </Button>
          </div>
        </CardHeader>
        <Divider />

        <CardBody className=" flex flex-row justify-between space-x-2">
          <Card shadow="sm" className="w-[50%] min-h-[calc(100vh_-_196px)]">
            <CardHeader className="h-[72px]">
              <div className=" text-[18px] text-danger-600 ">
                {`組織内のメンバー（${orgUsers.length}名）`}
              </div>
            </CardHeader>
            <CardBody>
              <CheckboxGroup
                value={deleteUsers}
                onChange={(values) => setDeleteUsers(values)}
                classNames={{
                  base: "w-full",
                }}
              >
                {orgUsers.map((user) => (
                  <CustzCheckboxOrgUser
                    key={user.id}
                    user={user}
                    org_id={search.get("org_id")}
                    fetchUserOptions={fetchUserOptions}
                  />
                ))}
              </CheckboxGroup>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                color="danger"
                variant="flat"
                isDisabled={deleteUsers.length === 0}
                onClick={() => handleDeleteusers()}
              >
                <div className=" w-full flex flex-row justify-between items-center">
                  <div className="w-[30%] text-start">
                    {deleteUsers.length} 選択された
                  </div>
                  <div className="w-[30%]">組織から取除</div>
                  <div className="w-[30%] text-end"></div>
                  <Icon width={16} icon="bi:chevron-double-right" />
                </div>
              </Button>
            </CardFooter>
          </Card>
          <Card shadow="sm" className="w-[50%] min-h-[calc(100vh_-_196px)]">
            <CardHeader className=" flex flex-row justify-between h-[72px]">
              <div className=" text-[18px] text-secondary-600">
                {`組織外のメンバー（${otherUsers.length}）`}
              </div>
              <Button
                color="secondary"
                variant="flat"
                onClick={userModal.onTrue}
              >
                ユーザー新規
              </Button>
            </CardHeader>
            <CardBody>
              <CheckboxGroup
                value={addUsers}
                onChange={(values) => setAddUsers(values)}
                classNames={{
                  base: "w-full",
                }}
              >
                {otherUsers.map((user) => (
                  <CustzCheckboxOtherUser
                    key={user.id}
                    user={user}
                    org_id={search.get("org_id")}
                    addUsers={addUsers}
                    setAddUsers={setAddUsers}
                    permissions={permissions}
                    setPermissions={setPermissions}
                  />
                ))}
              </CheckboxGroup>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                color="secondary"
                variant="flat"
                isDisabled={addUsers.length === 0}
                onClick={() => handleAddusers()}
              >
                <div className=" w-full flex flex-row justify-between items-center">
                  <div className="w-[30%]">
                    <Icon width={16} icon="bi:chevron-double-left" />
                  </div>

                  <div className="w-[30%]">組織に追加</div>
                  <div className="w-[30%] text-end">
                    {addUsers.length} 選択された
                  </div>
                </div>
              </Button>
            </CardFooter>
          </Card>
        </CardBody>
      </Card>
      <NewUserModal
        isOpen={userModal.value}
        onClose={userModal.onFalse}
        onOpenChange={userModal.onToggle}
        setUserIdFeild={setUserIdFeild}
      />
    </Fragment>
  );
}
