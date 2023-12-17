import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";

export default function OrgNode({ data }) {
  return (
    <div className=" flex flex-col justify-center items-center">
      <Card className="w-[240px] ">
        <CardHeader className="flex flex-row justify-between items-center">
          <Image width={40} src={data.avatarUrl} />
          <di className="flex flex-row justify-between items-center space-x-2">
            <Button isIconOnly>
              <Icon icon="bi:pencil" />
            </Button>
            <Button isIconOnly>
              <Icon icon="bi:plus" />
            </Button>
          </di>
        </CardHeader>
        <CardBody className="text-[22px]">{data.name}</CardBody>
      </Card>
    </div>
  );
}
