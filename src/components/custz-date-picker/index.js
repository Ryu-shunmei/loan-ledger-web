import { useState } from "react";
import { format } from "date-fns";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
} from "@nextui-org/react";
import { ja } from "date-fns/locale";

export function CustzDatePicher() {
  const [selected, setSelected] = useState();

  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p>You picked {format(selected, "PP")}.</p>;
  }
  return (
    <Popover>
      <PopoverTrigger>
        <Input
          type="date"
          value={date.toLocaleString()}
          color="secondary"
          size="sm"
          label="権利証（回収日"
          isReadOnly
        />
      </PopoverTrigger>
      <PopoverContent>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          footer={footer}
          locale={ja}
        />
      </PopoverContent>
    </Popover>
  );
}
