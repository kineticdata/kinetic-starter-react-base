import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { fetchKapp, fetchBridgedResource } from '@kineticdata/react';
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { KineticClientTable } from "../../Widgets/KineticClientTable";
import { CoreForm } from "@kineticdata/react/lib/components";
import { KineticModal } from "../../Widgets/KineticModal";

export const KappLanding = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('forms')
    }, [])

    // const globalState = useContext(GlobalContext);
    // const { updateBreadcrumbs, userProfile } = globalState;
    // const [ kappData, setKappData ] = useState();
    // const [ tableData, setTableData ] = useState();
    // const [ pageError, setPageError ] = useState();
    // const [ showModal, setShowModal ] = useState(false);
    // const { kappSlug } = useParams();

    // const columns = useMemo(() => (
    //     [{
    //         title: 'Subject', 
    //         value: 'subject', 
    //         sortBy: 'string',
    //     }, {
    //         title: 'Issue Summary', 
    //         value: 'issueSummary', 
    //         sortBy: 'string',
    //     },{
    //         title: 'Requested By', 
    //         value: 'requestedBy', 
    //         sortBy: 'string',
    //     },{
    //         title: ' ', 
    //         value: 'submissionLink', 
    //     }]
    // ), [])    
    
    // const getViewSubmissionsLink = id => (
    //         <Link 
    //             to={`ticket/${id}`} 
    //             className="link"
    //         >
    //             View Submission
    //         </Link>
    // );

    // const showModalButton = useMemo(() => (
    //     <button
    //         className="cancel"
    //         onClick={() => setShowModal(true)}
    //     >
    //             Report an Issue
    //     </button>
    // ) ,[])

    // const newSubmissionModal = useMemo(() => (
    //     <CoreForm 
    //         kapp={kappSlug}
    //         form={'report-an-issue'}
    //     />
    // ) , [kappSlug])

    // useEffect(() => {
    //     updateBreadcrumbs({
    //         pageNames: ['Kapps List', 'Kapp Landing'],
    //         path: `/kapps/${kappSlug}`
    //     });
    // }, [])

    // useEffect(() => {
    //     fetchKapp({kappSlug, include: 'details, attributesMap[Show Kapp Landing]'})
    //         .then(({ kapp, error }) => !error ? setKappData(kapp) : setPageError(error));
    // }, [])

    // useEffect(() => {
    //     if (kappData && userProfile) {
    //         fetchBridgedResource({
    //             bridgedResourceName: 'Submissions',
    //             formSlug: 'shared-resources',
    //             kappSlug: kappSlug,
    //             values: { 'Email': userProfile.email },
    //         }).then(({records, error}) => {
    //             if (!error) {
    //                 setTableData(records.map(record => (
    //                     {
    //                         subject: record['Subject'],
    //                         issueSummary: record['Issue Summary'],
    //                         requestedBy: record['Requested By Display Name'],
    //                         submissionLink: getViewSubmissionsLink(record['Id']),
    //                     }
    //                 )))
    //             } else {
    //                 setPageError(error);
    //             }
    //         }) 
    //     }
    // }, [kappData, userProfile])
    
    // useEffect(() => {
    //     if ((kappData && kappData.attributesMap['Show Kapp Landing'] && kappData.attributesMap['Show Kapp Landing'][0] !== 'true') || 
    //         (kappData && !kappData.attributesMap['Show Kapp Landing'])) {
    //         // use location replace so this page does not get added to browser history.
    //         window.location.replace(`${window.location.href}/forms`);
    //     }
    // }, [kappData])

    // return kappData && tableData && !pageError ? (
    //     <>
    //         <PageTitle title='KAPP LANDING' rightSide={showModalButton} />
    //         <KineticClientTable columns={columns} data={tableData} showPagination />
    //         <KineticModal
    //             isModalOpen={showModal} 
    //             setIsModalOpen={setShowModal} 
    //             modalTitle='New Issue'
    //             content={newSubmissionModal} 
    //         />
    //     </>
    // ) : <LoadingSpinner error={pageError} />;
};
