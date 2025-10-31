"use client";

import * as React from "react";

import { Checkbox } from "@/registry/default/ui/checkbox";
import { CheckboxGroup } from "@/registry/default/ui/checkbox-group";
import { Label } from "@/registry/default/ui/label";

const mainPermissions = [
  { id: "view-dashboard", name: "View Dashboard" },
  { id: "manage-users", name: "Manage Users" },
  { id: "access-reports", name: "Access Reports" },
];

const userManagementPermissions = [
  { id: "create-user", name: "Create User" },
  { id: "edit-user", name: "Edit User" },
  { id: "delete-user", name: "Delete User" },
  { id: "assign-roles", name: "Assign Roles" },
];

export default function CheckboxGroupNestedParentDemo() {
  const [mainValue, setMainValue] = React.useState<string[]>([]);
  const [managementValue, setManagementValue] = React.useState<string[]>([]);

  const managementIsPartial =
    managementValue.length > 0 &&
    managementValue.length !== userManagementPermissions.length;

  return (
    <CheckboxGroup
      allValues={mainPermissions.map((p) => p.id)}
      aria-labelledby="user-permissions-caption"
      onValueChange={(value) => {
        if (value.includes("manage-users")) {
          setManagementValue(userManagementPermissions.map((p) => p.id));
        } else if (
          managementValue.length === userManagementPermissions.length
        ) {
          setManagementValue([]);
        }
        setMainValue(value);
      }}
      value={mainValue}
    >
      <Label id="user-permissions-caption">
        <Checkbox indeterminate={managementIsPartial} parent />
        User Permissions
      </Label>

      {mainPermissions
        .filter((p) => p.id !== "manage-users")
        .map((p) => (
          <Label className="ms-4" key={p.id}>
            <Checkbox value={p.id} />
            {p.name}
          </Label>
        ))}

      <CheckboxGroup
        allValues={userManagementPermissions.map((p) => p.id)}
        aria-labelledby="manage-users-caption"
        className="ms-4"
        onValueChange={(value) => {
          if (value.length === userManagementPermissions.length) {
            setMainValue((prev) =>
              Array.from(new Set([...prev, "manage-users"]))
            );
          } else {
            setMainValue((prev) => prev.filter((v) => v !== "manage-users"));
          }
          setManagementValue(value);
        }}
        value={managementValue}
      >
        <Label id="manage-users-caption">
          <Checkbox parent />
          Manage Users
        </Label>

        {userManagementPermissions.map((p) => (
          <Label className="ms-4" key={p.id}>
            <Checkbox value={p.id} />
            {p.name}
          </Label>
        ))}
      </CheckboxGroup>
    </CheckboxGroup>
  );
}
