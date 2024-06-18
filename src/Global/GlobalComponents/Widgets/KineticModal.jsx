import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import { withClickOutside } from "../../GlobalResources/Helpers";

export const KineticModal = ( {isModalOpen, setIsModalOpen, modalTitle, content} ) => {
    const refPortal = forwardRef(({ setIsOpen }, ref) => {
            return(
                <>
                    {isModalOpen && createPortal( 
                        <div className="modal-background">
                            <div className="kinetic-modal-wrapper" ref={ref}>
                                <div className='modal-header'>
                                    {modalTitle}
                                    <button onClick={() => setIsOpen(false)} autoFocus aria-label="Close Modal.">
                                        <i className="las la-times button cancel" aria-hidden="true" />
                                    </button>
                                </div>
                                {content}
                            </div>
                        </div>,
                    document.body )}
                </>
            )
        })

    return withClickOutside(refPortal, isModalOpen, setIsModalOpen)
}