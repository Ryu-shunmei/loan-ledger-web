"use client";
import * as Yup from "yup";
import { useFormik } from "formik";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";

import myAxios from "@/utils/my-axios";

export default function NewBankModal({
  isOpen,
  onClose,
  onOpenChange,
  fetchBanks,
}) {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    type: Yup.string().required(),
  });

  const defaultValues = {
    name: "",
    type: "",
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (data) => {
      try {
        const response = await myAxios.post("/bank", data);
        console.log("new bank dailog", response.data);
        formik.resetForm();
        await fetchBanks();
        onClose();
      } catch (error) {
        console.log("new bank dailog", error);
      }
    },
  });
  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader className="flex flex-col gap-1 text-secondary-600">
            新規ユーザー
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div className=" flex flex-row justify-center items-start space-x-2">
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.name && Boolean(formik.errors.name)}
                  errorMessage={formik.touched.name && formik.errors.name}
                  color="secondary"
                  size="sm"
                  label="名称"
                  className="min-w-xs"
                />
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.type && Boolean(formik.errors.type)}
                  errorMessage={formik.touched.type && formik.errors.type}
                  selectedKeys={
                    !!formik.values.type ? [formik.values.type] : []
                  }
                  size="sm"
                  color="secondary"
                  label="提携種別"
                  className="min-w-xs"
                >
                  {["化学", "ハイム"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </Select>
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
