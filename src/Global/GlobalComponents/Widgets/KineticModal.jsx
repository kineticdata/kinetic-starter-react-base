import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import { withClickOutside } from "../../GlobalResources/Helpers";

export const KineticModal = ( {isModalOpen, setIsModalOpen, content} ) => {
    // TODO: Add a global function to track when modal is open
    // and use that to apply an opaque layer behind the modal that 
    // won't allow users to click something outside of the modal

    const refPortal = forwardRef(({ isOpen, setIsOpen }, ref) => {
            return(
                <>
                    {isModalOpen && createPortal( 
                        <div className="modal-background">
                            <div className="kinetic-modal-wrapper" ref={ref}>{content}</div>
                        </div>,
                    document.body )}
                </>
            )
        })

    return withClickOutside(refPortal, isModalOpen, setIsModalOpen)
}