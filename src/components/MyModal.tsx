import React, { ReactElement } from "react";
import { Modal } from "@material-ui/core";

const MyModal: React.FC<{
  children: ReactElement;
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {props.children}
    </Modal>
  );
};

export default MyModal;
