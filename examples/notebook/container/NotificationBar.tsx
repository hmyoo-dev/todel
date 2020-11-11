import React, { FC } from "react";
import { useServiceState } from "@todel/react";
import { selectNotificationService } from "../model/NotificationService";

export const NotificationBar: FC = () => {
  const items = useServiceState(selectNotificationService);

  const itemNodes =
    items.length < 1 ? (
      <li>No message.</li>
    ) : (
      items.map(({ id, message }) => <li key={id}>{message}</li>)
    );

  return <ul>{itemNodes}</ul>;
};
