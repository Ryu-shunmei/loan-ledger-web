"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
//
import CustzBreadcrumbs from "@/components/custz-breadcumbs";
import NewUserModal from "@/components/new-user-modal";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  cn,
  Textarea,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import { OrgConfig } from "@/utils/conf";
import myAxios from "@/utils/my-axios";
import { jwtDecode } from "jwt-decode";

const orgConfig = { "01": "本社", "02": "エリア", "03": "支店" };

export default function NewOrg() {
  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const schema = Yup.object().shape({
    // id: Yup.string().required(),
    org_id: Yup.string().required(), //
    user_id: Yup.string().required(), //
    execute_confirm: Yup.string(), //
    shbs_report: Yup.string(), //
    bank_id: Yup.string(), //
    loan_target: Yup.string(),
    ap_loan_applicable: Yup.string(), //
    excute_date: Yup.string(), //
    house_code: Yup.string(), //
    house_name: Yup.string(), //
    loan_amount: Yup.string(), //
    deposit_amount: Yup.string(), //
    heim_note: Yup.string(), //
    shbs_note: Yup.string(), //
    shbs_confirm: Yup.string(), //
    collection_date: Yup.string(),
    receive_date: Yup.string(),
    registrate_date: Yup.string(),
    schedule_date: Yup.string(),
    establish_date: Yup.string(),
    doc_send_date: Yup.string(),
    confirm_date: Yup.string(),
  });

  const defaultValues = {
    // id: "",
    org_id: "",
    user_id: "",
    execute_confirm: "",
    shbs_report: "",
    bank_id: "",
    loan_target: "",
    ap_loan_applicable: "",
    excute_date: "",
    house_code: "",
    house_name: "",
    loan_amount: "",
    deposit_amount: "",
    heim_note: "",
    shbs_note: "",
    shbs_confirm: "",
    collection_date: "",
    receive_date: "",
    registrate_date: "",
    schedule_date: "",
    establish_date: "",
    doc_send_date: "",
    confirm_date: "",
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (data) => {
      console.log(data);
      try {
        await myAxios.post("/case", data);
        router.push(`/dashboard/cases`);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const setUserIdFeild = async (value) => {
    await fetchUserOptions();
    formik.setFieldValue("user_id", `${value}`);
  };

  const [userOptions, setUserOpyions] = useState([]);
  const [orgOptions, setOrgOpyions] = useState([]);
  const [bankOptions, setBankOpyions] = useState([]);

  const fetchUserOptions = useCallback(async () => {
    try {
      const response = await myAxios.get(
        `/layouts/org/users?role_id=${
          jwtDecode(localStorage.getItem("accessToken", {})).curr_role_id
        }&org_id=${formik.values.org_id}`
      );
      console.log("fetchUserOptions", response.data);
      setUserOpyions(response.data["org_users"]);
    } catch (error) {
      console.log("fetchUserOptions", error);
    }
  }, [formik.values.org_id]);

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

  const fetchBankOptions = useCallback(async () => {
    try {
      const response = await myAxios.get("/banks");
      console.log("fetchBankOptions", response.data);
      setBankOpyions(response.data);
    } catch (error) {
      console.log("fetchBankOptions", error);
    }
  }, []);

  useEffect(() => {
    fetchBankOptions();
    fetchOrgOptions();
  }, []);

  useEffect(() => {
    if (!!formik.values.org_id) {
      fetchUserOptions();
    }
  }, [formik.values.org_id]);
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
          <div className="text-[20px]">案件新規</div>
          <div className=" space-x-2">
            <Button
              color="secondary"
              variant="flat"
              onClick={() => router.push("/dashboard/cases")}
            >
              戻る
            </Button>
            <Button
              color="secondary"
              variant="solid"
              type="submit"
              // onClick={() => console.log(values)}
            >
              確認
            </Button>
          </div>
        </CardHeader>
        <Divider />

        <CardBody className="space-y-2">
          <div className="text-secondary-600">担当者情報</div>
          <div className="flex flex-row space-x-2">
            <Select
              name="org_id"
              value={formik.values.org_id}
              onChange={formik.handleChange}
              isInvalid={formik.touched.org_id && Boolean(formik.errors.org_id)}
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
              name="user_id"
              value={formik.values.user_id}
              onChange={formik.handleChange}
              size="sm"
              color="secondary"
              label="担当者"
              className="min-w-xs"
            >
              {/* <SelectItem
                key={jwtDecode(localStorage.getItem("accessToken", {})).id}
                value={jwtDecode(localStorage.getItem("accessToken", {})).id}
              >
                {`${
                  jwtDecode(localStorage.getItem("accessToken", {})).last_name
                } ${
                  jwtDecode(localStorage.getItem("accessToken", {})).first_name
                }`}
              </SelectItem> */}
              {userOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {`${option.last_name} ${option.first_name}`}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Divider />
          <div className="text-secondary-600">ローン情報</div>
          <div className="space-y-2">
            <div className=" space-x-3">
              <Checkbox
                name="execute_confirm"
                size="md"
                color="secondary"
                onValueChange={(v) =>
                  formik.setFieldValue("execute_confirm", v)
                }
              >
                実行確定
              </Checkbox>
              <Checkbox
                name="shbs_report"
                size="md"
                color="secondary"
                onValueChange={(v) => formik.setFieldValue("shbs_report", v)}
              >
                SHBS財務Ｇ報告用
              </Checkbox>
              <Checkbox
                name="shbs_confirm"
                size="md"
                color="secondary"
                onValueChange={(v) => formik.setFieldValue("shbs_confirm", v)}
              >
                SHBS確認欄
              </Checkbox>
            </div>
            <div className=" flex flex-row space-x-2">
              <Select
                name="bank_id"
                value={formik.values.bank_id}
                onChange={formik.handleChange}
                size="sm"
                color="secondary"
                label="所属銀行"
                className="min-w-xs"
              >
                {bankOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                name="loan_target"
                value={formik.values.loan_target}
                onChange={formik.handleChange}
                size="sm"
                color="secondary"
                label="ローン対象"
                className="min-w-xs"
              >
                <SelectItem value="土地">土地</SelectItem>
                <SelectItem value="建物中間">建物中間</SelectItem>
                <SelectItem value="建物最終">建物最終</SelectItem>
              </Select>
              <Select
                name="ap_loan_applicable"
                value={formik.values.ap_loan_applicable}
                onChange={formik.handleChange}
                size="sm"
                color="secondary"
                label="APローン該当"
                className="min-w-xs"
              >
                <SelectItem value="有">有</SelectItem>
                <SelectItem value="無">無</SelectItem>
              </Select>
              <Input
                name="excute_date"
                type="date"
                value={formik.values?.excute_date}
                onChange={formik.handleChange}
                color="secondary"
                size="sm"
                label="実行日"
                className="min-w-xs"
              />
            </div>
            <div className=" flex flex-row space-x-2">
              <Input
                name="house_code"
                value={formik.values?.house_code}
                onChange={formik.handleChange}
                color="secondary"
                size="sm"
                label="邸コード"
                className="min-w-xs"
              />
              <Input
                name="house_name"
                value={formik.values?.house_name}
                onChange={formik.handleChange}
                color="secondary"
                size="sm"
                label="邸名"
                className="min-w-xs"
              />
              <Input
                name="loan_amount"
                value={formik.values?.loan_amount}
                onChange={formik.handleChange}
                color="secondary"
                size="sm"
                label="借入金額"
                className="min-w-xs"
              />
              <Input
                name="deposit_amount"
                type="number"
                value={formik.values?.deposit_amount}
                onChange={formik.handleChange}
                color="secondary"
                size="sm"
                label="着金金額"
                className="min-w-xs"
              />
            </div>
          </div>
          <Divider />
          <div>
            <div className="text-secondary-600">抵当権情報</div>
            <div>
              <div className=" grid grid-cols-4 gap-4 space-x-2">
                <Input
                  name="collection_date"
                  type="date"
                  value={formik.values?.collection_date}
                  onChange={formik.handleChange}
                  color="secondary"
                  size="sm"
                  label="権利証（回収日"
                  className="min-w-xs"
                />
                <Input
                  name="receive_date"
                  type="date"
                  value={formik.values?.receive_date}
                  onChange={formik.handleChange}
                  color="secondary"
                  size="sm"
                  label="抵当権（書類受理日）"
                  className="min-w-xs"
                />
                <Input
                  name="registrate_date"
                  type="date"
                  value={formik.values?.registrate_date}
                  onChange={formik.handleChange}
                  color="secondary"
                  size="sm"
                  label="抵当権（登記依頼日）"
                  className="min-w-xs"
                />
                <Input
                  name="schedule_date"
                  type="date"
                  value={formik.values?.schedule_date}
                  onChange={formik.handleChange}
                  color="secondary"
                  size="sm"
                  label="抵当権（完了予定日）"
                  className="min-w-xs"
                />
                <Input
                  name="establish_date"
                  type="date"
                  value={formik.values?.establish_date}
                  onChange={formik.handleChange}
                  color="secondary"
                  size="sm"
                  label="抵当権（設定日）"
                  className="min-w-xs"
                />
                <Input
                  name="doc_send_date"
                  type="date"
                  value={formik.values?.doc_send_date}
                  onChange={formik.handleChange}
                  color="secondary"
                  size="sm"
                  label="抵当権（設定書類送付日）"
                  className="min-w-xs"
                />
                <Input
                  name="confirm_date"
                  type="date"
                  value={formik.values?.confirm_date}
                  onChange={formik.handleChange}
                  color="secondary"
                  size="sm"
                  label="責任者確認日"
                  className="min-w-xs"
                />
              </div>
            </div>
          </div>

          <Divider />
          <div>
            <div className="text-secondary-600">備考情報</div>
            <div className="flex flex-row justify-start items-center space-x-2">
              <Textarea
                name="heim_note"
                value={formik.values?.heim_note}
                onChange={formik.handleChange}
                color="secondary"
                label="備考(ハイム使用欄）"
              />
              <Textarea
                name="shbs_note"
                value={formik.values?.shbs_note}
                onChange={formik.handleChange}
                color="secondary"
                label="備考(ＳＨＢＳ使用欄）"
              />
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
