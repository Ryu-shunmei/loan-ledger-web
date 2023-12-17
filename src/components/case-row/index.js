import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function CaseRow({ data }) {
  const router = useRouter();
  return (
    <Card
      radius="sm"
      className="border-none bg-secondary-50/60 hover:bg-secondary-50 min-h-[176px]"
      shadow="sm"
    >
      <CardHeader>
        <div className="flex flex-row h-3 w-full justify-between items-center space-x-4 text-small ">
          <div className="flex flex-row h-3 w-full justify-start items-center space-x-4">
            <CellItemRow title="支店名" value={data.org_name} />
            <CellItemRow
              title="担当者"
              value={`${data.last_name} ${data.first_name}`}
            />
          </div>
          <div className="flex flex-row h-3 w-full justify-end items-center space-x-4">
            <CellItemRow
              title="実行確定"
              value={!!data.execute_confirm ? "済" : "未"}
            />
            <CellItemRow
              title="SHBS財務Ｇ報告用"
              value={!!data.shbs_report ? "済" : "未"}
            />
            <CellItemRow
              title="SHBS確認欄"
              value={!!data.shbs_confirm ? "済" : "未"}
            />
            <Button
              size="sm"
              color="secondary"
              className="h-7"
              onClick={() =>
                router.push(`/dashboard/cases/edit?case_id=${data.id}`)
              }
            >
              編集
            </Button>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-row h-[70px] w-full justify-between items-center space-x-4 text-small ">
          <div className=" w-full flex flex-col space-y-1">
            <div className=" h-[30px] w-full grid grid-cols-5 gap-5">
              <CellItemRow title="銀行名" value={data.bank_name} />
              <CellItemRow title="提携先" value={data.type} />
              <CellItemRow title="ローン対象" value={data.loan_target} />
              <CellItemRow
                title="APローン該当"
                value={data.ap_loan_applicable}
              />
              <CellItemRow title="実行日" value={data.excute_date} />
            </div>
            <Divider />
            <div className=" h-[30px] w-full grid grid-cols-5 gap-5 items-start">
              <CellItemRow title="邸コード" value={data.house_code} />
              <CellItemRow title="邸名" value={data.house_name} />
              <CellItemRow
                title="借入金額"
                value={data.loan_amount.toLocaleString()}
              />
              <CellItemRow
                title="差引諸費用"
                value={data.deduction_amount.toLocaleString()}
              />
              <CellItemRow
                title="着金金額"
                value={data.deposit_amount.toLocaleString()}
              />
            </div>
          </div>
          <div className=" flex flex-row space-x-2 ">
            <CellItemTextArea
              title="備考(ハイム使用欄）"
              value={data.heim_note}
            />
            <CellItemTextArea
              title="備考(ＳＨＢＳ使用欄）"
              value={data.shbs_note}
            />
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex flex-row h-5 w-full justify-between items-center space-x-2 text-small">
          <CellItemCol title="権利証（回収日）" value={data.collection_date} />
          <Divider orientation="vertical" />
          <CellItemCol title="抵当権（書類受理日）" value={data.receive_date} />
          <Divider orientation="vertical" />
          <CellItemCol
            title="抵当権（登記依頼日）"
            value={data.registrate_date}
          />
          <Divider orientation="vertical" />
          <CellItemCol
            title="抵当権（完了予定日）"
            value={data.schedule_date}
          />
          <Divider orientation="vertical" />
          <CellItemCol title="抵当権（設定日）" value={data.establish_date} />
          <Divider orientation="vertical" />
          <CellItemCol
            title="抵当権（設定書類送付日）"
            value={data.doc_send_date}
          />
          <Divider orientation="vertical" />
          <CellItemCol title="責任者確認日" value={data.confirm_date} />
        </div>
      </CardFooter>
    </Card>
  );
}

const CellItemCol = ({ title, value }) => {
  return (
    <div className="flex flex-col justify-start items-start space-y-[2px]">
      <div className="text-[10px] text-secondary-400 leading-[10px]">
        {title}
      </div>
      <div
        radius="sm"
        className="text-[14px] leading-[16px] text-secondary-800"
      >
        {!!value ? value : "ーー"}
      </div>
    </div>
  );
};

const CellItemRow = ({ title, value }) => {
  return (
    <div className="flex flex-row justify-start items-center space-x-[2px]">
      <div className="text-[12px] text-secondary-400 ">{title}:</div>
      <div className="text-[12px] text-secondary-800">
        {!!value ? value : "ーー"}
      </div>
    </div>
  );
};

const CellItemTextArea = ({ title, value }) => {
  return (
    <div className=" min-h-[80px] min-w-[150px] flex flex-col justify-start items-start space-x-[2px]  p-1  border-[1px] rounded-md">
      <div className="text-[12px] text-secondary-400 ">{title}:</div>
      <div className="text-[12px] text-secondary-800">
        {!!value ? value : "ーー"}
      </div>
    </div>
  );
};
