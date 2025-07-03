import axios from "axios";
import { toast } from "react-toastify";

import { setOnboarding } from "../feature/Onboarding";
import { setAuth } from "../feature/Auth";
import { setAccount } from "../feature/account";

export const createUserAPI =
  (data, setLoading, setError, navigate) => async (dispatch, getState) => {
    setLoading(true);

    let config = {
      method: "post",
      url: `${getState().auth.baseurl}/usermodule/createuser`,
      data,
    };

    axios(config)
      .then((response) => {
        if (response.data?.status === "BAD_REQUEST") {
          toast.error(response.data?.message);
          setError(response.data);
        } else if (response.data?.status === "SUCCESS") {
          toast.success("Information Recorded");
          dispatch(setAuth({ isOnboarded: "Y" }));
        } else {
          toast.warning("Something went wrong!");
        }
        setLoading(false);
      })
      .catch((error) => {
        const response = error.response;
        if (response.data?.status === "BAD_REQUEST") {
          toast.error(response.data?.message);
          setError(response.data);
        } else if (response.data?.status === "SUCCESS") {
          toast.success("Information Recorded");
          dispatch(setAuth({ isOnboarded: "Y" }));
        } else {
          toast.warning("Something went wrong!");
        }
        setLoading(false);
      });
  };

export const getKycInformation =
  (setLoading, openLink = false) =>
  async (dispatch, getState) => {
    setLoading(true);

    let config = {
      method: "get",
      url: `${getState().auth.baseurl}/kyc/getKyc`,
    };

    axios(config)
      .then((response) => {
        let data = response.data;
        // data = { ...data, kycStatus: "AML_REJECTED", complianceStatus: "ACTION_REQUIRED" } //temp

        if (
          (data?.kybStatus === "not_submitted" ||
            data?.kybStatus === "pending") &&
          getState().auth?.userType === "Business"
        ) {
          console.log("started");
          const docsRequired = [
            {
              name: "Accounting Corporate Regulatory Authority Report",
              key: "accounting_corporate_regulatory_authority_report",
            },
            {
              name: "Board Resolution",
              key: "board_resolution",
            },
            {
              name: "Business Address Proof",
              key: "business_address_proof",
            },
            {
              name: "Certificate of Good Standing",
              key: "certificate_of_good_standing",
            },
            {
              name: "Certificate of Incorporation",
              key: "certificate_of_incorporation",
            },
            {
              name: "Certificate of Incumbency",
              key: "certificate_of_incumbency",
            },
            {
              name: "Certificate of Registration",
              key: "certificate_of_registration",
            },
            {
              name: "Memorandum and Articles of Association",
              key: "memorandum_and_articles_of_association",
            },
          ];

          let flag = true;
          for (let doc of docsRequired) {
            if (
              !data?.KYBDocumentsUplodedDetails?.map(
                (item) => item?.document_type
              )?.includes(doc?.key)
            ) {
              flag = false;
              break;
            }
          }
          if (flag) {
            dispatch(setOnboarding({ kycData: data }));
            dispatch(submitDocsForBusiness(setLoading));
            return;
          }
          dispatch(setAccount({ isVACreated: "N" }));
        }

        if (
          data?.kybStatus === "submitted" &&
          getState().auth?.userType?.toLowerCase() === "business"
        ) {
          dispatch(setAccount({ isVACreated: "N" }));
        }

        if (
          data?.kycStatus === "PENDING" &&
          data?.complianceStatus === "IN_PROGRESS"
        ) {
          if (openLink) {
            window.open(data?.kycLink, "_blank").focus();
            setLoading(false);
          }
          dispatch(setAccount({ isVACreated: "N" }));
        }

        if (
          (data?.kycStatus === "CLEARED" &&
            data?.complianceStatus === "APPROVED") ||
          (data?.kycStatus === "REJECTED" &&
            data?.complianceStatus === "REJECTED") ||
          (data?.kycStatus === "AML_REJECTED" &&
            data?.complianceStatus === "ACTION_REQUIRED")
        ) {
          dispatch(setAccount({ isVACreated: "N" }));
        }

        if (
          data?.kycStatus === "PENDING" &&
          data?.complianceStatus === "RFI_REQUESTED"
        ) {
          // Call GETRFI
          dispatch(setOnboarding({ kycData: data }));
          dispatch(setAccount({ isVACreated: "N" }));
          dispatch(getRFIAPI(setLoading));
          return;
        }

        dispatch(setOnboarding({ kycData: data }));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

export const sendKycInformationMMCorporateAPI =
  (data, setUploadKycPending) => async (dispatch, getState) => {
    setUploadKycPending(true);

    let config = {
      method: "post",
      url: `${getState().auth.baseurl}/kyc/uploadkyc`,
      data,
    };

    axios(config)
      .then((response) => {
        dispatch(getKycInformation(setUploadKycPending));
        if (response.data.status !== "BAD_REQUEST")
          toast.success("Uploaded Successfully");
        else toast.error(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        setUploadKycPending(false);
      });
  };

export const submitDocsForBusiness =
  (setLoading) => async (dispatch, getState) => {
    setLoading(true);

    let config = {
      method: "post",
      url: `${getState().auth.baseurl}/kyc/submitkyc`,
    };

    axios(config)
      .then((response) => {
        dispatch(getKycInformation(setLoading));
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

const getRFIAPI = (setLoading) => async (dispatch, getState) => {
  setLoading(true);

  let config = {
    method: "get",
    url: `${getState().auth.baseurl}/kyc/getrfi`,
  };

  axios(config)
    .then((response) => {
      if (response.data?.status === "SUCCESS")
        dispatch(
          setOnboarding({
            isRFI: true,
            rfiReason: response.data?.declined_reason,
          })
        );
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
};

export const respondRFIAPI =
  (setLoading, setRefreshButtonVisible) => async (dispatch, getState) => {
    setLoading(true);

    let config = {
      method: "get",
      url: `${getState().auth.baseurl}/kyc/RespondRfi`,
    };

    axios(config)
      .then((response) => {
        if (response.data.status === "BAD_REQUEST") {
          toast.error(response.data.message);
          setLoading(false);
          return;
        }
        window.open(response.data?.kycLink, "_blank").focus();
        setLoading(false);
        setRefreshButtonVisible(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
