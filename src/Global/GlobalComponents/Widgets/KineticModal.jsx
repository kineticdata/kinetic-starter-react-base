import React, { forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { withClickOutside } from "../../GlobalResources/Helpers";

export const KineticModal = ( {isModalOpen, closeModal, modalTitle, content} ) => {
    const buttonFocus = useRef(null);

    // When the modal is opened move focus to the close button
    // and then blur so that the focus is placed but not visible.
    useEffect(() => {
        if(buttonFocus.current !== null) {
            buttonFocus.current.focus();
            buttonFocus.current.blur()
        }
    }, [isModalOpen])

    const refPortal = forwardRef(({ setIsOpen }, ref) => {
            return(
                <>
                    {isModalOpen && createPortal( 
                        <div className="modal-background">
                            <div className="kinetic-modal-wrapper" ref={ref}>
                                <div className='modal-header'>
                                    {modalTitle}
                                    <button onClick={() => setIsOpen()} ref={buttonFocus} aria-label="Close Modal.">
                                        <i className="las la-times" aria-hidden="true" />
                                    </button>
                                </div>
                                {content}
                            </div>
                        </div>,
                    document.body )}
                </>
            )
        })

    return withClickOutside(refPortal, isModalOpen, closeModal)
}