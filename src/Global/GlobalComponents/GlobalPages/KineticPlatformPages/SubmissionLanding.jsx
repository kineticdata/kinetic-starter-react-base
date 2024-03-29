import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageTitle } from "../../Widgets/PageTitle";
import { fetchSubmission, deleteSubmission } from '@kineticdata/react';
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { formatDate } from "../../../GlobalResources/Helpers";
import { KineticTable } from "../../Widgets/KineticTable";
import { KineticModal } from "../../Widgets/KineticModal";

export const SubmissionLanding = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ submissionData, setSubmissionData ] = useState();
    const [ tableData, setTableData ] = useState();
    const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
    const [ isEditMode, setIsEditMode ] = useState(false);
    const { kappSlug, formSlug, submissionsId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(submissionData) {
            updateBreadcrumbs({ 
                page: `Submission: ${submissionData.label} `, 
                path: `/kapps/${kappSlug}/forms/${formSlug}/submissions/${submissionsId}`
            });
        }
    }, [submissionData]);

    useEffect(() => {
        fetchSubmission({ id: submissionsId, include: 'values, details' }).then(({ submission }) => {
            const parsedData = Object.keys(submission.values).map((key) => { 
                return {
                    question: key,
                    answer: submission.values[key] || ''
                }})
            setSubmissionData(submission);
            setTableData(parsedData);
        });  
    }, [submissionsId]);

    // TODO: Need to do error handling for this - probably for everything actually
    const confirmDeleteSubmission = () => {
        deleteSubmission({ id: submissionsId }).then(() => navigate(`/kapps/${kappSlug}/forms/${formSlug}/submissions`));
    }

    const columns = useMemo(() => {
        return [{
            title: 'Questions', 
            value: 'question', 
            sortBy: 'string',
        }, {
            title: 'Answers', 
            value: 'answer', 
            sortBy: 'string',
        }];
    });

    const submissionsFooter = useMemo(() => {
        return (
            <div className="submissions-footer-wrapper">
                <div 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="button edit"
                >
                    Edit
                </div>
                <div 
                    onClick={() => setIsDeleteOpen(!isDeleteOpen)}
                    className="button delete"
                >
                    Delete
                </div>
            </div>
        )
    }, [isDeleteOpen, isEditMode])

    const editSubmissionFooter = useMemo(() => {
        return (
            <div className="submissions-footer-wrapper">
                <span>
                    <div 
                        onClick={() => console.log('UPDATE')}
                        className="button update"
                    >
                        <i className="fa fa-check" aria-hidden="true" />
                        Update Submission
                    </div>
                    <div 
                        onClick={() => setIsEditMode(!isEditMode)}
                        className="button cancel"
                    >
                        Cancel
                    </div>
                </span>
                <div 
                    onClick={() => setIsDeleteOpen(!isDeleteOpen)}
                    className="button delete"
                >
                    Delete
                </div>
            </div>
        )
    }, [isDeleteOpen, isEditMode]);

    // TODO: add the actual content for this
    const deleteSubmissionModal = useMemo(() => {
        return (
            <div>
                <div className="modal-header">Are you sure you want to delete this Submission?</div>
                <div>Are you sure you want to proceed?</div>
                <div className="modal-buttons-wrapper">
                    <div 
                        onClick={() => setIsDeleteOpen(false)}
                        className="button cancel"
                    >
                        Cancel
                    </div>
                    <div 
                        onClick={() => confirmDeleteSubmission()}
                        className="button delete-red-bg"
                    >
                        Delete Submission
                    </div>
                </div>
            </div>
        )
    }, []);

    return submissionData && tableData ? (
        <>
            <PageTitle title={`Submission: ${submissionData.label}`} />
            <div className="submission-information">
                <div className="spacer"><b>State: </b><div className={`state ${submissionData.coreState.toLowerCase()} left-space`}>{submissionData.coreState}</div></div>
                <div className="spacer"><b>Created at: </b>{formatDate(submissionData.createdAt, 'MMMM Do, YYYY - h:mm:ss a')}</div>
                <div className="spacer"><b>Updated at at: </b>{formatDate(submissionData.updatedAt, 'MMMM Do, YYYY - h:mm:ss a')}</div>
                <div className="spacer"><b>Submitted at: </b>{submissionData.submittedAt ? 
                    formatDate(submissionData.submittedAt, 'MMMM Do, YYYY - h:mm:ss a') 
                    : 'Not submitted'}</div>
                <div className="spacer"><b>Closed at: </b>{submissionData.closedAt ? 
                    formatDate(submissionData.closedAt, 'MMMM Do, YYYY - h:mm:ss a') 
                    : 'Not closed'}</div>
            </div>
            <KineticTable 
                columns={columns} 
                data={tableData} 
                customerFooter={isEditMode ? editSubmissionFooter : submissionsFooter} 
            />
            <KineticModal 
                isModalOpen={isDeleteOpen} 
                setIsModalOpen={setIsDeleteOpen} 
                content={deleteSubmissionModal} 
            />
        </>
    ) : <LoadingSpinner />
};
