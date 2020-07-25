import { expendedItemType, itemCosmeticPrimaryType } from "types";
import { deepClone, toPrimitiveType } from "../utils/other";
import { CosmeticItemsModelDB } from "../utils/database/cosmeticItemsModelDB";
import stores from "./../stores/store";
import { TaskDB } from "../utils/database/taskDB";
import { taskObjectDB, taskDBType } from "types";
import { isIdenticalDays, dateСomparison } from "../utils/dates";
import moment from "moment";
import { TASKKEY } from "../utils/database/config";

export const updateTaskAfterUpdateItem = async (
  object: itemCosmeticPrimaryType
) => {
  const createDateItem = moment(object.date).format(TASKKEY);
  const items = await TaskDB.getAll();
  let closedObject: { day: boolean; evening: boolean };

  const itemsNeeded: taskDBType[] = items.filter((item: taskDBType) =>
    dateСomparison(item.date, object.date as Date, object.timingDelay.value)
  );

  const newItems = itemsNeeded.map((item: taskDBType) => {
    return {
      task: [
        ...item.task.map((task) =>
          object.name === task.name ? { ...object, closed: task.closed } : task
        ),
      ],
      date: item.date,
    };
  });

  const promises = await Promise.all(
    newItems.map((item: taskDBType) => {
      const key = moment(item.date).format(TASKKEY);
      return TaskDB.update(key, deepClone(item)).then((x) => x);
    })
  );
  return promises;
};

export const updateTaskAfterDeleteItem = async (
  object: itemCosmeticPrimaryType
) => {
  const createDateItem = moment(object.date).format(TASKKEY);
  const items = await TaskDB.getAll();

  const needed = items.map((item: taskDBType) => {
    return {
      task: item.task.filter((itemTask) => itemTask.name !== object.name),
      date: item.date,
    };
  });
  const promises = await Promise.all(
    needed.map((item: taskDBType) => {
      const key = moment(item.date).format(TASKKEY);
      return TaskDB.update(key, deepClone(item)).then((x) => x);
    })
  );
  return promises;
};

export const updateTaskAfterNewItem = async () => {
  const items = await TaskDB.getAll();
  const newItem = toPrimitiveType(
    stores.ItemsCosmetic.currentItem as expendedItemType
  );
  const itemsNeeded = items.filter((item: taskDBType) =>
    dateСomparison(item.date, newItem.date as Date, newItem.timingDelay.value)
  );
  const updatePromises = await Promise.all(
    itemsNeeded.map((item: taskDBType) => {
      const newObject: taskDBType = { ...item };
      const key = moment(item.date).format(TASKKEY);
      newObject.task.push({
        ...newItem,
        closed: { day: false, evening: false },
      });
      return TaskDB.update(key, deepClone(newObject)).then((x) => x);
    })
  );
  return updatePromises;
};

export const saveInDBNewItemCosmetic = async (object: expendedItemType) => {
  const formDBObject = toPrimitiveType(object);
  const result = await CosmeticItemsModelDB.set(
    formDBObject.name.trim(),
    deepClone(formDBObject)
  );
};