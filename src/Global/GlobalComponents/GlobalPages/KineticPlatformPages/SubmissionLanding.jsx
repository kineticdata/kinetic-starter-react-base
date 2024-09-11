import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../Widgets/PageTitle";
import { fetchSubmission, deleteSubmission } from '@kineticdata/react';
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { formatDate, getStatusColors } from "../../../GlobalResources/Helpers";
import { KineticForm } from "../../Widgets/KineticForm"
import { ActivitiesList } from "../../Widgets/Activities/ActivitiesList";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';

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

    const getChipStyle = useMemo(() => {
        return submissionData && getStatusColors(submissionData.coreState);
    }, [submissionData])

    const confirmDeleteSubmission = () => {
        deleteSubmission({ id: submissionsId }).then(({error}) => !error ? navigate(`/kapps/${kappSlug}/forms/${formSlug}/submissions`) : setPageError(error));
    }

    const submissionsFooter = useMemo(() => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '1.25rem 2.4rem', maxHeight: '2rem', m: '.5rem 0'}}>
                <Button 
                    variant={isEditMode ? 'text' : 'contained'}
                    onClick={() => setIsEditMode(!isEditMode)} 
                    sx={isEditMode ? { color: 'primary.secondary' } : 
                        {
                            color: 'greyscale.quinary',
                            bgcolor: 'primary.secondary',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: 'primary.main',
                            },
                        }
                    } 
                    aria-label="Close Modal."
                >
                    {isEditMode ? 'Cancel' : 'Edit'}
                </Button>
                <Button 
                    variant='contained'
                    onClick={() => setIsDeleteOpen(true)} 
                    sx={{
                        color: 'greyscale.quinary',
                        bgcolor: 'error.secondary',
                        fontWeight: 'bold',
                        '&:hover': {
                            bgcolor: 'error.main',
                        },
                    }} 
                    aria-label="Close Modal."
                >
                    Delete
                </Button>
            </Box>
        )
    }, [isDeleteOpen, isEditMode]);

    return submissionData && !pageError ? (
        <>
            <PageTitle title={`Submission: ${submissionData.label}`} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '1rem' }}>
                <Box sx={{ mr: '1rem' }}><b>State: </b><Chip label={submissionData.coreState} sx={{ ml: '1rem', p: '.25rem .75rem', ...getChipStyle }} /></Box>
                <Box sx={{ mr: '1rem' }}><b>Created at: </b>{formatDate(submissionData.createdAt, 'MMMM Do, YYYY - h:mm:ss a')}</Box>
                <Box sx={{ mr: '1rem' }}><b>Updated at at: </b>{formatDate(submissionData.updatedAt, 'MMMM Do, YYYY - h:mm:ss a')}</Box>
                <Box sx={{ mr: '1rem' }}><b>Submitted at: </b>{submissionData.submittedAt ? 
                    formatDate(submissionData.submittedAt, 'MMMM Do, YYYY - h:mm:ss a') 
                    : 'Not submitted'}</Box>
                <Box sx={{ mr: '1rem' }}><b>Closed at: </b>{submissionData.closedAt ? 
                    formatDate(submissionData.closedAt, 'MMMM Do, YYYY - h:mm:ss a') 
                    : 'Not closed'}</Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
                <Box 
                    sx={{
                        mb: '3rem',
                        borderRadius: '.75rem',
                        boxShadow: '0 .25rem .375rem -.125rem rgba(0, 0, 0, 0.05), 0 .625rem 1rem -3px rgba(0, 0, 0, 0.1)',
                        border: '1px solid',
                        borderColor: 'greyscale.tertiary',
                        bgcolor: 'greyscale.quinary',
                        flex: activityData ? '2' : '',
                    }}
                >
                    <KineticForm        
                        submissionId={submissionsId}
                        isEditMode={!isEditMode}
                    />
                    {canEdit && submissionsFooter}
                </Box>
                {activityData && <ActivitiesList activities={activityData} />}
            </Box>
            <Modal
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                aria-labelledby="delete-submission"
                aria-describedby="delete-this-submission"
            >
                <Box
                id='delete-submission-modal-wrapper'
                sx={{
                    width: '38.125rem',
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'greyscale.quaternary',
                    p: '2.5rem',
                    borderRadius: '.25rem'
                }}
                >
                    <>
                        <Box 
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                lineHeight: '1.25',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                borderBottom: '1px solid',
                                borderColor: 'secondary.secondary',
                                mb: '1.5rem',
                                pb: '1.5rem'
                            }}
                            >
                                Delete Submission
                            <Button 
                                onClick={() => closeModal()} 
                                sx={{ 
                                minWidth: '0',
                                color: 'primary.secondary',
                                fontWeight: 'bold',
                                '&:hover': {
                                    color: 'primary.main',
                                    backgroundColor: 'primary.quaternary',
                                },
                                }} 
                                aria-label="Close Modal."
                            >
                                <CloseIcon sx={{p: '.5rem', fontSize: '2.5rem'}} />
                            </Button>
                        </Box>
                        <Box>
                            <Box>Are you sure you want to delete this Submission?</Box>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                gap: '1.5rem', 
                                mt: '1.5rem', 
                                pt: '1.5rem', 
                                borderTop: '1px solid', 
                                borderTopColor: 'secondary.secondary' 
                            }}>
                                <Button 
                                    aria-label="Delete submission."
                                    onClick={() => confirmDeleteSubmission()}
                                    sx={{ 
                                        bgcolor: 'error.secondary', 
                                        color: 'greyscale.quinary', 
                                        '&:hover': {
                                          backgroundColor: 'error.main',
                                        },
                                    }}
                                >
                                    Delete Submission
                                </Button>
                            </Box>
                        </Box>
                    </>
                </Box>
            </Modal>
        </>
    ) : <LoadingSpinner error={pageError} />
};
