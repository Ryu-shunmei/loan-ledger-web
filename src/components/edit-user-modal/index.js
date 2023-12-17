"use client";
import * as Yup from "yup";
import { useFormik } from "formik";

import React, { useCallback, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
} from "@nextui-org/react";

import myAxios from "@/utils/my-axios";
import { jwtDecode } from "jwt-decode";

export default function EditUserModal({
  isOpen,
  onClose,
  onOpenChange,
  user_id,
}) {
  const schema = Yup.object().shape({
    last_name: Yup.string().required(),
    first_name: Yup.string().required(),
    email: Yup.string().email().required(),
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
      try {
        const response = await myAxios.post("/user", data);
        console.log("new user dailog", response.data);
        setUserIdFeild(response.data?.id);
        formik.resetForm();
        onClose();
      } catch (error) {
        console.log("new user dailog", error);
      }
    },
  });

  const fetchUserData = useCallback(async () => {
    try {
      const response = await myAxios.get(`/user/basic?user_id=${user_id}`);
      console.log("fetchUserData", response.data);
    } catch (error) {
      console.log("fetchUserData", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader className="flex flex-col gap-1 text-secondary-600">
            ユーザー編集
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div className=" flex flex-row justify-center items-start space-x-2">
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
                    formik.touched.first_name &&
                    Boolean(formik.errors.first_name)
                  }
                  errorMessage={
                    formik.touched.first_name && formik.errors.first_name
                  }
                  color="secondary"
                  size="sm"
                  label="名"
                  className="min-w-xs"
                />
              </div>
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
