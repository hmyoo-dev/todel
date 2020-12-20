import React, { FC } from "react";
import { useNoticesData } from "../model/atom/notice/NoticesAtom";

export const NotificationBar: FC = () => {
  const { items } = useNoticesData();

  const itemNodes =
    items.length < 1 ? (
      <li>No message.</li>
    ) : (
      items.map(({ id, message }) => <li key={id}>{message}</li>)
    );

  return <ul>{itemNodes}</ul>;
};
