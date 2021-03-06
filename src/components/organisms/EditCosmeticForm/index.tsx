import React from "react";
import style from "./style.scss";
import { Button, DropdownProps, Form } from "semantic-ui-react";
import { formDataType, itemCosmeticPrimaryType } from "types";
import { dataFields } from "../../../utils/mocks/dataFields";
import moment from "moment";
import {
  DataRecord,
  SelectRecord,
  TextAreaRecord,
} from "../../molecules/index";

type typeFieldChangeHandler = (e: any, data: formDataType) => any;
type EditCosmeticForm = {
  fieldChangeHandler: typeFieldChangeHandler;
  defaultValues: itemCosmeticPrimaryType;
  disabled?: boolean;
  clickHandler?: VoidFunction;
};

export const EditCosmeticForm: React.FC<EditCosmeticForm> = ({
  fieldChangeHandler,
  defaultValues,
  clickHandler = () => {},
  disabled = true,
}) => {
  const selectChangeHandler = (callback: typeFieldChangeHandler) => (
    field: string
  ) => (e: any, data: DropdownProps) => {
    const result = {
      field: field,
      value: data.value as number,
      text: (e.target as HTMLDivElement).innerText,
      error: "",
    };
    callback(e, result);
  };

  return (
    <>
      {!(defaultValues as itemCosmeticPrimaryType) && (
        <h1>Такой предмет не найден</h1>
      )}
      {defaultValues && (
        <>
          <h1>{defaultValues.name}</h1>
          <Form className={style.form}>
            <TextAreaRecord
              defaultValue={defaultValues!.description!}
              label={"Описание"}
              classComponent={style.inputWrapper}
              blurHandler={(e) => {
                const data = {
                  field: "description",
                  value: e.target.value,
                  text: "",
                  error: "",
                };
                fieldChangeHandler(e, data);
              }}
            />

            <SelectRecord
              placeholder="2 дня"
              classComponent={style.inputWrapper}
              label="Повторять каждые"
              defaultValue={defaultValues!.timingDelay.value}
              options={dataFields.days}
              changeHandler={selectChangeHandler(fieldChangeHandler)(
                "timingDelay"
              )}
            />

            <SelectRecord
              placeholder="Утро и вечер"
              classComponent={style.inputWrapper}
              label="Время дня:"
              defaultValue={defaultValues!.dayOrEvening.value}
              options={dataFields.dayTime}
              changeHandler={selectChangeHandler(fieldChangeHandler)(
                "dayOrEvening"
              )}
            />

            <SelectRecord
              placeholder={dataFields.priority[0].text}
              classComponent={style.inputWrapper}
              label="Тип косметики"
              defaultValue={defaultValues!.type!.value}
              options={dataFields.priority}
              changeHandler={selectChangeHandler(fieldChangeHandler)("type")}
            />

            <DataRecord
              label="Дата"
              defaultValue={defaultValues.date}
              classComponent={style.inputWrapper}
              changeHandler={(e) => {
                const result = {
                  field: "date",
                  value: moment(e.target.value).set({ hour: 15 }).toDate(),
                  text: (e.target as HTMLDivElement).innerText,
                  error: "",
                };
                fieldChangeHandler(e, result);
              }}
            />

            <Button secondary disabled={disabled} onClick={clickHandler}>
              Редактировать
            </Button>
          </Form>
        </>
      )}
    </>
  );
};
