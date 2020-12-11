import { useAtom } from "@todel/react";
import React, { FC } from "react";
import { selectNoticesAtom } from "../model/atom/notice/NoticesAtom";

export const NotificationBar: FC = () => {
  const { items } = useAtom(selectNoticesAtom);

  const itemNodes =
    items.length < 1 ? (
      <li>No message.</li>
    ) : (
      items.map(({ id, message }) => <li key={id}>{message}</li>)
    );

  return <ul>{itemNodes}</ul>;
};
