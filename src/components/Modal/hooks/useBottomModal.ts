import { useRef } from "react";
import type { BottomModalRef } from "../types";

const useBottomModal = () => {
  const ref = useRef<BottomModalRef>(null);

  const show = () => {
    ref.current?.show();
  };

  const dismiss = () => {
    ref.current?.dismiss();
  };

  return {
    /**
     * Deconstruct this property on your BottomModal component. Simply puts a ref to your modal
     * @example <BottomModal height={200} {...modalProps} />
     */
    modalProps: { ref },

    /**
     * Shows modal
     */
    show,

    /**
     * Hides modal
     */
    dismiss,

    /**
     * true if modal is visible
     */
    isActive: ref.current?.isActive
  };
};

export { useBottomModal };
