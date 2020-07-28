import React, { FunctionComponent } from "react";
import { Page } from "../../components/Page/index";
import { Calendar } from "../../components/Calendar/index";
import { Header } from "../../components/Header/index";
import { Content } from "../../components/Content";
import { IMainStore } from "../../stores/MainStore";
import { TodayWidgetTodoList } from "../../components/TodayWidgetTodoList";
import { UploadDailyTask } from "../../components/UploadDailyTask";
import { TodoListContent } from "../../components/TodoListContent";

import { toJS } from "mobx";
import { inject, observer } from "mobx-react";

export const Main: FunctionComponent<IMainStore> = inject("stores")(
  observer(({ stores }) => {
    stores!.Setting.config;
    const getField = (key: string) =>
      stores!.Setting.config.find((item) => item.key === key);

    const TodayWidgetWrap = () => {
      const field = getField("todoListWidget");
      if (field && field.value) {
        return (
          <UploadDailyTask>
            <TodayWidgetTodoList />
          </UploadDailyTask>
        );
      }
      return <></>;
    };

    const CalendarWrap = () => {
      const field = getField("calendar");
      if (field && field.value) {
        return <Calendar />;
      }
      return <></>;
    };

    const FullTodoListWrap = () => {
      const field = getField("todoListFull");
      if (field && field.value) {
        return (
          <UploadDailyTask>
            <TodoListContent />
          </UploadDailyTask>
        );
      }
      return <></>;
    };
    return (
      <Page>
        <Header />
        <Content>
          <TodayWidgetWrap></TodayWidgetWrap>
          <CalendarWrap></CalendarWrap>
          <FullTodoListWrap></FullTodoListWrap>
        </Content>
      </Page>
    );
  })
);
