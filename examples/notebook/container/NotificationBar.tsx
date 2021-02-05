import React, { FC } from "react";
import { useNoticesAtom } from "../model/atom/notice/NoticesAtom";

export const NotificationBar: FC = () => {
  const items = useNoticesAtom((atom) => atom.state.items);

  const itemNodes =
    items.length < 1 ? (
      <li>No message.</li>
    ) : (
      items.map(({ id, message }) => <li key={id}>{message}</li>)
    );

  return <ul>{itemNodes}</ul>;
};
