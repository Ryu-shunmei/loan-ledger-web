import { useBoolean } from "@/hooks/use-boolean";
import { Checkbox, Link, User, Chip, cn, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import NewPermissionsModal from "../new-user-permissions-modal";
import EditPermissionsModal from "../edit-user-permissions-modal";
import { RolesConfig, OrgConfig } from "@/utils/conf";
import EditRoleModal from "../edit-user-role-permissions-modal";

const userTypeConfig = {
  24: "本社担当者",
  25: "支店権限者",
  26: "営業担当者",
};

export function CustzCheckboxOrgUser({ user, org_id, fetchUserOptions }) {
  const showPermissions = useBoolean();
  return (
    <Checkbox
      classNames={{
        base: cn(
          "inline-flex max-w-md min-w-full bg-content2 m-0",
          "hover:bg-content3 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 py-2 px-4 border-2 border-transparent",
          "data-[selected=true]:border-danger"
        ),
        label: "w-full",
      }}
      color="danger"
      value={user.id}
    >
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start gap-1">
          <span>{`${user.last_name} ${user.first_name}`}</span>
          <span className="text-tiny text-default-500">{user.email}</span>
        </div>
        <div className="flex flex-row justify-center items-center gap-1 space-x-2">
          <Chip color="danger" size="sm" variant="flat">
            {RolesConfig.find((item) => item.id === user.type).name}
          </Chip>
          <Button
            color="danger"
            variant="shadow"
            size="sm"
            onClick={showPermissions.onTrue}
          >
            権限編集
          </Button>
        </div>
      </div>
      <EditPermissionsModal
        isOpen={showPermissions.value}
        onClose={showPermissions.onFalse}
        onOpenChange={showPermissions.onToggle}
        user_id={user.id}
        org_id={org_id}
        user_name={`${user.last_name} ${user.first_name}`}
        fetchUserOptions={fetchUserOptions}
      />
    </Checkbox>
  );
}

export function CustzCheckboxOtherUser({
  user,
  addUsers,
  setAddUsers,
  permissions,
  setPermissions,
}) {
  const showPermissions = useBoolean();
  return (
    <Checkbox
      onValueChange={(v) => {
        if (v === true && !permissions[user.id]) {
          showPermissions.onTrue();
        }
        if (v === false) {
          const tempPermissions = JSON.parse(JSON.stringify(permissions));
          delete tempPermissions[user.id];
          setPermissions(tempPermissions);
          const tempAddUsers = addUsers.filter((id) => id !== user.id);
          setAddUsers(tempAddUsers);
        }
      }}
      classNames={{
        base: cn(
          "inline-flex max-w-md min-w-full bg-content2 m-0",
          "hover:bg-content3 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 py-2 px-4 border-2 border-transparent",
          "data-[selected=true]:border-secondary"
        ),
        label: "w-full",
      }}
      color="secondary"
      value={user.id}
    >
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start gap-1">
          <span>{`${user.last_name} ${user.first_name}`}</span>
          <span className="text-tiny text-default-500">{user.email}</span>
        </div>
        {Object.keys(permissions).includes(user.id) && (
          <div className="flex flex-row justify-center items-center gap-1 space-x-2">
            <Chip size="sm" color="secondary">
              {
                RolesConfig.find(
                  (item) => item.id === permissions[user.id].type
                ).name
              }
            </Chip>
            <Button
              color="danger"
              variant="shadow"
              size="sm"
              onClick={showPermissions.onTrue}
            >
              権限編集
            </Button>
          </div>
        )}
      </div>
      {showPermissions.value && (
        <NewPermissionsModal
          isOpen={showPermissions.value}
          onClose={showPermissions.onFalse}
          onOpenChange={showPermissions.onToggle}
          permissions={permissions}
          setPermissions={setPermissions}
          user_id={user.id}
          user_name={`${user.last_name} ${user.first_name}`}
        />
      )}
    </Checkbox>
  );
}

export function CustzCheckboxUserRole({
  user_name,
  user_id,
  role,
  fetchUserData,
}) {
  const showPermissions = useBoolean();
  return (
    <Checkbox
      classNames={{
        base: cn(
          "inline-flex max-w-md min-w-full bg-content2 m-0",
          "hover:bg-content3 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 py-2 px-4 border-2 border-transparent",
          "data-[selected=true]:border-danger"
        ),
        label: "w-full",
      }}
      color="danger"
      value={role.org_id}
    >
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start gap-1">
          <span className="text-tiny text-default-500">所属組織</span>
          <span className="text-[14px]">{role.org_name}</span>
        </div>
        <div className="flex flex-row justify-center items-center gap-1 space-x-2">
          <Chip color="danger" size="sm" variant="flat">
            {RolesConfig.find((item) => item.id === role.role_type).name}
          </Chip>
          <Button
            color="danger"
            variant="shadow"
            size="sm"
            onClick={showPermissions.onTrue}
          >
            権限編集
          </Button>
        </div>
      </div>
      <EditRoleModal
        isOpen={showPermissions.value}
        onClose={showPermissions.onFalse}
        onOpenChange={showPermissions.onToggle}
        user_id={user_id}
        org_id={role.org_id}
        org_name={role.org_name}
        role_type={role.role_type}
        user_name={user_name}
        fetchUserData={fetchUserData}
      />
    </Checkbox>
  );
}
