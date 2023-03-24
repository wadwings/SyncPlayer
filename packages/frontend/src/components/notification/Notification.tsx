import React, { useEffect } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import eventbus from "../EventBus";

const Notification = () => {
  useEffect(() => {
    const variants: ("success" | "error" | "info" | "warning" | "default")[] = [
      "success",
      "error",
      "info",
      "warning",
      "default",
    ];
    const offlist = variants.map((variant) => {
      const fn = (message: string) => 
        enqueueSnackbar(message, { variant: variant });
      eventbus.on(variant, fn);
      return {variant, fn}
    });
    return () => {
      offlist.forEach(value => {
        eventbus.off(value.variant, value.fn)
      })
    }
  }, []);

  return (
    <div>
      <SnackbarProvider />
    </div>
  );
};

export default Notification;
