import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../Widgets/PageTitle";
import { fetchSubmission, deleteSubmission } from '@kineticdata/react';
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { formatDate, humanizeFileSize } from "../../../GlobalResources/Helpers";
import { KineticTable } from "../../Widgets/KineticTable";
import { KineticModal } from "../../Widgets/KineticModal";
import { CoreForm } from "@kineticdata/react/lib/components";

export const SubmissionLanding = () => {
    const urlPrefix = process.env.REACT_APP_PROXY_HOST;
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
    const [ isEditMode, setIsEditMode ] = useState(false);
    const [ showTableView, setShowTableView ] = useState(true);
    const [ canEdit, setCanEdit ] = useState();
    const [ submissionData, setSubmissionData ] = useState();
    const [ tableData, setTableData ] = useState();
    const { kappSlug, formSlug, submissionsId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubmission({ id: submissionsId, include: 'values, details, authorization' }).then(({ submission }) => {
            const parsedData = Object.keys(submission.values).map((key) => { 
                let arrayData = null;
                // Arrays are returned from the Kinetic Platform as an immutable list, which reads as an object
                // therefore the first check is verifying the value is a List and the second is verifying it's a 
                // List of objects
                if (typeof submission.values[key] === 'object') {
                    if (typeof submission.values[key][0] === 'object') {
                        arrayData = submission.values[key].map(value =>  {
                            // TODO: Attachement links will have to be tested in deployed envs
                            // may have to use process.env.REACT_APP_API_HOST instead of proxy
                            return ({
                                toDisplay: (
                                    <div className="file-link-wrapper">
                                        <a href={`${urlPrefix}/${value.link.split('/').slice(2).join('/')}`} className="file-link" rel="noopener noreferrer" target="_blank">{value.name}</a>
                                        <div className="file-size">&#x28;{humanizeFileSize(value.size)}&#x29;</div>
                                    </div>
                                    ),
                                toSort: value.name
                            })
                        }).reduce((prev, current) => [prev, ', ', current])
                    } else {
                        arrayData = submission.values[key].join(', ');
                    }
                }
                
                return {
                    field: key,
                    value: (arrayData && arrayData) || submission.values[key] || ''
                }
            })

            setSubmissionData(submission);
            setCanEdit(submission.authorization['Modification']);
            setTableData(parsedData);
        });  
    }, [kappSlug, formSlug, submissionsId]);

    useEffect(() => {
        if(submissionData) {
            updateBreadcrumbs({ 
                page: `Submission: ${submissionData.label} `, 
                path: `/kapps/${kappSlug}/forms/${formSlug}/submissions/${submissionsId}`
            });
        }
    }, [kappSlug, formSlug, submissionsId]);

    const columns = useMemo(() => {
        return [{
            title: 'Field', 
            value: 'field', 
            sortBy: 'string',
        }, {
            title: 'Value', 
            value: 'value', 
            sortBy: 'string',
        }];
    });

    // TODO: Need to do error handling for this - probably for everything actually
    const confirmDeleteSubmission = () => {
        deleteSubmission({ id: submissionsId }).then(() => navigate(`/kapps/${kappSlug}/forms/${formSlug}/submissions`));
    }

    const submissionsFooter = useMemo(() => {
        return (
            <div className="submissions-footer-wrapper with-border">
                <div 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`button${isEditMode ? ' cancel' : ' edit with-icon'}`}
                >
                    {isEditMode ? 'Cancel' : 'Edit'}
                </div>
                <div 
                    onClick={() => setIsDeleteOpen(!isDeleteOpen)}
                    className="button delete"
                >
                    Delete
                </div>
            </div>
        )
    }, [isDeleteOpen, isEditMode]);

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

    const getView = useMemo(() => {
        if (submissionData) {
            if (isEditMode) {
                return (
                    <div className="form-page-wrapper">
                        <CoreForm          
                            submission={submissionsId}
                            onCompleted={() => navigate(0)}
                            onUpdated={() => navigate(0)}
                        />
                        {submissionsFooter}
                    </div>
                )
            } else if (showTableView === true) {
                return (
                    <KineticTable 
                        columns={columns} 
                        data={tableData} 
                        customerFooter={canEdit && submissionsFooter} 
                    />
                )
            } else {
                return (
                    <div className="form-page-wrapper">
                        <CoreForm          
                            submission={submissionsId}
                            review={true}
                        />
                        {canEdit && submissionsFooter}
                    </div>
                )
            }
        }
    }, [ submissionData, showTableView, isEditMode ])

    const toggleView = useMemo(() => {
        if (!isEditMode) {
            if (showTableView) {
                return (
                    <button className="button cancel" onClick={() => setShowTableView(false)}>Show Form View</button>
                )
            } else {
                return (
                    <button className="button cancel" onClick={() => setShowTableView(true)}>Show Table View</button>
                )
            }
        }
    }, [showTableView, isEditMode])

    return submissionData && tableData ? (
        <>
            <PageTitle title={`Submission: ${submissionData.label}`} rightSide={toggleView} />
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
            {getView}
            <KineticModal 
                isModalOpen={isDeleteOpen} 
                setIsModalOpen={setIsDeleteOpen} 
                content={deleteSubmissionModal} 
            />
        </>
    ) : <LoadingSpinner />
};
