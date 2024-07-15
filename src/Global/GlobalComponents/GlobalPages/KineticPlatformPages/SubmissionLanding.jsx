import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../Widgets/PageTitle";
import { fetchSubmission, deleteSubmission } from '@kineticdata/react';
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { formatDate } from "../../../GlobalResources/Helpers";
import { KineticModal } from "../../Widgets/KineticModal";
import {KineticForm} from "../../Widgets/KineticForm"
import { ActivitiesList } from "../../Widgets/Activities/ActivitiesList";

export const SubmissionLanding = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const navigate = useNavigate();
    const { kappSlug, formSlug, submissionsId } = useParams();
    const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
    const [ isEditMode, setIsEditMode ] = useState(false);
    const [ canEdit, setCanEdit ] = useState();
    const [ submissionData, setSubmissionData ] = useState();
    const [ activityData, setActivityData ] = useState();
    const [ pageError, setPageError ] = useState();

    useEffect(() => {
        if(submissionData) {
            updateBreadcrumbs({ 
                pageNames: [
                    'Kapps List',
                    submissionData.form.kapp.name,
                    'Forms List',
                    submissionData.form.name,
                    'Submissions List',
                    submissionData.id
                ],
                path: `/kapps/${kappSlug}/forms/${formSlug}/submissions/${submissionData.id}`,
            });
        }
    }, [submissionData]);

    useEffect(() => {
        fetchSubmission({
            id: submissionsId, 
            include: 'values, details, activities, activities.details, authorization, form, form.kapp'
        }).then(({ submission, error }) => {
            if (!error) {
                submission.activities?.length && setActivityData(submission.activities)
                setSubmissionData(submission);
                setCanEdit(submission.authorization['Modification']);
            } else {
                setPageError(error);
            }
        });  
    }, [kappSlug, formSlug, submissionsId]);

    const confirmDeleteSubmission = () => {
        deleteSubmission({ id: submissionsId }).then(({error}) => !error ? navigate(`/kapps/${kappSlug}/forms/${formSlug}/submissions`) : setPageError(error));
    }

    const submissionsFooter = useMemo(() => {
        return (
            <div className="submissions-footer-wrapper with-border">
                <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`${isEditMode ? 'tertiary-btn' : 'edit-btn with-icon'}`}
                >
                    {isEditMode ? 'Cancel' : 'Edit'}
                </button>
                <button 
                    onClick={() => setIsDeleteOpen(!isDeleteOpen)}
                    className="delete"
                >
                    Delete
                </button>
            </div>
        )
    }, [isDeleteOpen, isEditMode]);

    const deleteSubmissionModal = useMemo(() => {
        return (
            <div>
                <div>Are you sure you want to proceed?</div>
                <div className="modal-buttons-wrapper">
                    <button 
                        aria-label="Delete submission."
                        onClick={() => confirmDeleteSubmission()}
                        className="delete-red-bg"
                    >
                        Delete Submission
                    </button>
                </div>
            </div>
        )
    }, []);

    return submissionData && !pageError ? (
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
            <div className="with-activities-wrapper">
                <div className={`form-page-wrapper ${activityData ? 'add-flex-3' : ''}`}>
                    <KineticForm        
                        submissionId={submissionsId}
                        isEditMode={!isEditMode}
                    />
                    {canEdit && submissionsFooter}
                </div>
                {activityData && <ActivitiesList activities={activityData} styling='activities-list-wrapper' />}
            </div>
            <KineticModal 
                isModalOpen={isDeleteOpen} 
                setIsModalOpen={setIsDeleteOpen} 
                modalTitle='Are you sure you want to delete this Submission?'
                content={deleteSubmissionModal} 
            />
        </>
    ) : <LoadingSpinner error={pageError} />
};
