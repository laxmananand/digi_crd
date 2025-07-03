import {
  AccountBalanceWallet,
  AddCard,
  AppRegistration,
  CreditCard,
  CreditCardOff,
  Notes,
  Password,
  PsychologyAlt,
  Settings,
  Tune,
  VpnLock,
  WorkHistory,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CreditCardView,
  CustomButton,
  CustomInput,
  CustomModal,
  CustomSelect,
} from "../../@component_v2/CustomComponents";
import { addAccount } from "./dashboard";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../../@redux/feature/Utility";
import { Divider } from "@mui/material";
import {
  activateCardDetails,
  addPhysicalCard,
  addVirtualCard,
  permanentBlockCardDetails,
  setPINCard,
  temporaryBlockCardDetails,
  unBlockCardDetails,
} from "../../@redux/action/account";
import regex from "./../utility/regex";

export const Cards = () => {
  const cards = useSelector((state) => state.account.cards);

  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SetPage = () => {
    dispatch(setActiveTab("Dashboard"));
    navigate("/dashboard");
  };

  const userDetails = useSelector((state) => state.auth.userDetails);

  if (!userDetails) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4 vh-80">
        <div className="d-flex flex-column justify-content-center align-items-center gap-1">
          <img src="/kyc.png" alt="" style={{ width: 250 }} />

          <label className="text-secondary">
            Whoops! It looks like you haven't registered yet.
          </label>
        </div>

        <CustomButton
          label={"Register Now"}
          icon={<AppRegistration />}
          style={{ width: 350, margin: "0 auto" }}
          isLoading={isLoading}
          onClick={() => {
            dispatch(setActiveTab("Dashboard"));
            navigate("/dashboard");
          }}
        />
      </div>
    );
  }

  const type = useSelector((state) => state.auth.type);
  const kybDetails = useSelector((state) => state.auth.kycDetails);
  const program = useSelector((state) => state.utility.program);

  if (
    program === "SMMACS0" &&
    ((type === "individual" &&
      kybDetails?.kycStatus?.toLowerCase() !== "completed") ||
      (type === "business" &&
        kybDetails?.kybStatus?.toLowerCase() !== "completed"))
  ) {
    return (
      <>
        {type === "individual" &&
        kybDetails.kycStatus.toLowerCase() !== "completed" ? (
          <>
            <div
              className="d-flex flex-column justify-content-center align-items-center gap-4"
              style={{ height: "80vh", padding: "0 20rem" }}
            >
              <img
                src="/verification.png"
                alt=""
                style={{ width: 300, height: 300, objectFit: "cover" }}
              />

              <label
                htmlFor=""
                className="fs-7 text-secondary px-2 text-center"
              >
                {kybDetails?.kycStatus.toLowerCase() === "pending"
                  ? `Your KYC verification hasn't been started yet. Complete the process now to add your virtual account.`
                  : `We've received your KYC documents and is currently under review. We'll notify you once verification is complete.`}
              </label>
              {kybDetails?.kycStatus.toLowerCase() === "pending" ? (
                <CustomButton
                  label={`Complete ${type === "business" ? "KYB" : "KYC"}`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              ) : (
                <CustomButton
                  label={`Check ${type === "business" ? "KYB" : "KYC"} Details`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              )}
            </div>
          </>
        ) : type === "business" && kybDetails.kybStatus !== "completed" ? (
          <>
            <div
              className="d-flex flex-column justify-content-center align-items-center gap-4"
              style={{ height: "80vh", padding: "0 20rem" }}
            >
              <img
                src="/verification.png"
                alt=""
                style={{ width: 300, height: 300, objectFit: "cover" }}
              />

              <label
                htmlFor=""
                className="fs-7 text-secondary px-2 text-center"
              >
                {kybDetails?.kybStatus === "not_submitted"
                  ? `Your business verification (${
                      type === "business" ? "KYB" : "KYC"
                    }) hasn't been submitted yet. Complete the process now to activate your account.`
                  : `Your ${
                      type === "business" ? "KYB" : "KYC"
                    } documents have been submitted and are currently under review. We'll notify you once verification is complete.`}
              </label>
              {kybDetails?.kybStatus === "not_submitted" ? (
                <CustomButton
                  label={`Complete ${type === "business" ? "KYB" : "KYC"}`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              ) : (
                <CustomButton
                  label={`Check ${type === "business" ? "KYB" : "KYC"} Details`}
                  icon={<WorkHistory />}
                  onClick={() => {
                    dispatch(setActiveTab("Settings"));
                    navigate(
                      `/settings/${type === "business" ? "kyb" : "kyc"}`
                    );
                  }}
                  isLoading={isLoading}
                  divClass="w-60"
                />
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }

  const [form, setForm] = useState("view-card");
  const [activeCard, setActiveCard] = useState(null);

  const account = useSelector((state) => state.account.accountDetails);

  const [isOpen, setOpen] = useState(false);

  const openCardModal = () => {
    setOpen(true);
  };

  const handleCloseCardModal = () => {
    setOpen(false);
  };

  const [isOpenActions, setOpenActions] = useState(false);

  const openCardModalActions = ({ item }) => {
    setActiveCard(item);
    setOpenActions(true);
  };

  const handleCloseCardModalActions = () => {
    setActiveCard(null);
    setOpenActions(false);
  };

  if (account.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center gap-4 vh-80">
        <img src="/banks/bank-icon.svg" alt="" style={{ width: "10%" }} />

        <label className="text-secondary">
          It looks like you haven't added your account yet.
        </label>

        <CustomButton
          label={"Add Account"}
          icon={<AccountBalanceWallet />}
          style={{ width: 350, margin: "0 auto" }}
          isLoading={isLoading}
          onClick={() => addAccount({ dispatch, setLoading, SetPage })}
        />
      </div>
    );
  }

  const AddCardModalContent = () => {
    const dispatch = useDispatch();
    const [cardLoading, setCardLoading] = useState(false);
    const [cardProxyNumber, setCardProxyNumber] = useState("");
    const [cardLast4Digits, setCardLast4Digits] = useState("");

    const feeDetails = useSelector((state) => state.utility.feeDetails);
    const [platformFee, setPlatformFee] = useState("");
    const [platformFeePhysical, setPlatformFeePhysical] = useState("");

    useEffect(() => {
      if (feeDetails.length > 0) {
        let virtualFee = feeDetails.find(
          (item) => item.fee_code === "ADVCARD"
        )?.value;

        let physicalFee = feeDetails.find(
          (item) => item.fee_code === "ADPCARD"
        )?.value;

        if (virtualFee) {
          setPlatformFee(virtualFee); // Handle cases where p2pFee or amount is missing
        }

        if (physicalFee) {
          setPlatformFeePhysical(physicalFee);
        }
      }
    }, [feeDetails]);

    return (
      <div
        style={{
          width: "100%",
          overflowY: "auto",
          padding: "1rem 0",
        }}
      >
        <div className="me-3 ms-2">
          <div className="d-flex align-items-center justify-content-between border-bottom border-2 pb-3">
            <div
              style={{
                padding: 8,
                borderRadius: "50%",
                border: "1px solid gray",
              }}
            >
              <AddCard className="text-primary" fontSize="medium" />
            </div>

            <div className="d-flex flex-column ps-4">
              <label className="fs-6 fw-bold">Add A New Card</label>
              <label className="fs-8 text-secondary">
                Streamline your checkout process by adding a new card for future
                transactions. Your card information is secured with advanced
                encryption technology.
              </label>
            </div>
          </div>

          {/* <CreditCardView
            item={{
              accountid: "4e60373e30ff3cec08365d349f79ef30",
              last4: cardLast4Digits,
              createdAt: "2025-01-14",
              cardid: "89638ee1b66e0456589d22bbb8c35e5a",
              currency: "USD",
              type: "virtual",
              cardStatus: "active",
            }}
            dispatch={dispatch}
            hide={true}
          /> */}

          <CustomButton
            icon={<CreditCard />}
            onClick={async () =>
              await dispatch(
                addVirtualCard({ setCardLoading, handleCloseCardModal })
              )
            }
            label={"Add Virtual Card"}
            style={{ margin: "15px 0" }}
            isLoading={cardLoading}
          />
        </div>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <Divider className="w-50" />{" "}
          <label htmlFor="" className="text-secondary fs-6">
            OR
          </label>{" "}
          <Divider className="w-50" />
        </div>

        <div className="ms-3 me-2">
          <h5
            style={{
              textAlign: "center",
              color: "brown",
              fontWeight: 600,
              padding: "15px 0",
            }}
          >
            Assign A Physical Card
          </h5>

          {/* <CreditCardView
            item={{
              accountid: "4e60373e30ff3cec08365d349f79ef30",
              last4: cardLast4Digits,
              createdAt: "2025-01-14",
              cardid: "89638ee1b66e0456589d22bbb8c35e5a",
              currency: "USD",
              type: "physical",
              cardStatus: "active",
            }}
            dispatch={dispatch}
            hide={true}
          /> */}

          <div className="d-flex align-items-center gap-3 my-1">
            <CustomInput
              label="Card Proxy Number"
              value={cardProxyNumber}
              onInput={setCardProxyNumber}
              type="cardNumber"
              required
              max={12}
              regex={regex.cardNumber}
            />
            <CustomInput
              label="Last 4 Digits"
              value={cardLast4Digits}
              onInput={setCardLast4Digits}
              type="fourDigits"
              required
              max={4}
              regex={regex.cardLast4Digits}
            />
          </div>

          <CustomButton
            label={"Add Physical Card"}
            icon={<CreditCard />}
            onClick={async () =>
              await dispatch(
                addPhysicalCard({
                  cardProxyNumber,
                  cardLast4Digits,
                  setCardLoading,
                  handleCloseCardModal,
                })
              )
            }
            style={{ marginTop: 5 }}
            isLoading={cardLoading}
          />
        </div>
      </div>
    );
  };

  const ChangeCardModal = () => {
    const [cardLoading, setCardLoading] = useState(false);
    const [pin, setPIN] = useState("");
    const [tBlockReason, setTBlockReason] = useState("");
    const [pBlockReason, setPBlockReason] = useState("");

    return (
      <div
        style={{
          width: "100%",
          padding: "1rem",
        }}
      >
        <div>
          <div className="d-flex align-items-center justify-content-between border-bottom border-2 pb-3 mb-3">
            <div
              style={{
                padding: 8,
                borderRadius: "50%",
                border: "1px solid gray",
              }}
            >
              <Settings className="text-primary" fontSize="medium" />
            </div>

            <div className="d-flex flex-column ps-4">
              <label className="fs-6 fw-bold">Manage Your Card Settings</label>
              <label className="fs-8 text-secondary">
                Easily manage your payment methods by adding a new card for
                seamless transactions. Your details are protected with
                industry-leading encryption for maximum security.
              </label>
            </div>
          </div>

          <div className="">
            {/* Activate Card */}
            {activeCard.cardStatus === "pending activation" && (
              <>
                <div className="card-action-container">
                  <CustomButton
                    label={"Activate Card"}
                    icon={<CreditCard />}
                    onClick={async () =>
                      await dispatch(
                        activateCardDetails({
                          cardId: activeCard.cardid,
                          setCardLoading,
                          handleCloseCardModalActions,
                        })
                      )
                    }
                    isLoading={cardLoading}
                  />

                  <div className="d-flex justify-content-center align-items-center gap-3 px-4">
                    <Divider className="w-50" />{" "}
                    <label htmlFor="" className="text-secondary fs-6">
                      OR
                    </label>{" "}
                    <Divider className="w-50" />
                  </div>
                </div>
              </>
            )}

            {/* Unblock Card */}
            {activeCard.cardStatus === "locked" && (
              <>
                <div className="card-action-container">
                  <CustomButton
                    label={"Unblock Card"}
                    icon={<CreditCard />}
                    onClick={async () =>
                      await dispatch(
                        unBlockCardDetails({
                          cardId: activeCard.cardid,
                          setCardLoading,
                          handleCloseCardModalActions,
                        })
                      )
                    }
                    isLoading={cardLoading}
                  />

                  <div className="d-flex justify-content-center align-items-center gap-3 px-4">
                    <Divider className="w-50" />{" "}
                    <label htmlFor="" className="text-secondary fs-6">
                      OR
                    </label>{" "}
                    <Divider className="w-50" />
                  </div>
                </div>
              </>
            )}

            {/* Set PIN */}
            {activeCard.type === "physical" && (
              <div className="card-action-container">
                <h5 className="fw-bold">Set PIN</h5>
                <CustomInput
                  type="pin"
                  label="Enter PIN"
                  value={pin}
                  onInput={setPIN}
                  max={4}
                  leftIcon={<Password />}
                  required
                  regex={regex.pin}
                />
                <CustomButton
                  label={"Set PIN"}
                  icon={<Password />}
                  onClick={async () =>
                    await dispatch(
                      setPINCard({
                        pin,
                        cardId: activeCard.cardid,
                        setCardLoading,
                        handleCloseCardModalActions,
                      })
                    )
                  }
                  isLoading={cardLoading}
                />
              </div>
            )}

            {/* Temporary Block Card */}
            {activeCard.cardStatus === "active" && (
              <div className="card-action-container">
                <h5 className="fw-bold">Temporary Block Card</h5>
                <CustomInput
                  type="alphanumeric"
                  label="Reason for block"
                  value={tBlockReason}
                  onInput={setTBlockReason}
                  maxLength={200}
                  leftIcon={<PsychologyAlt />}
                  required
                  regex={regex.alphanumeric}
                  max={50}
                />
                <CustomButton
                  label={"Temporary Block Card"}
                  icon={<CreditCardOff />}
                  onClick={async () =>
                    await dispatch(
                      temporaryBlockCardDetails({
                        reason: tBlockReason,
                        cardId: activeCard.cardid,
                        setCardLoading,
                        handleCloseCardModalActions,
                      })
                    )
                  }
                  isLoading={cardLoading}
                />
              </div>
            )}

            {/* Permanent Block Card */}
            {activeCard.cardStatus !== "suspended" && (
              <div className="card-action-container">
                <h5 className="fw-bold">Permanent Block Card</h5>

                <CustomSelect
                  options={[
                    { value: "stolen", label: "Stolen" },
                    { value: "lost", label: "Lost" },
                    { value: "damaged", label: "Damaged" },
                  ]}
                  id="pBlockReason"
                  value={pBlockReason}
                  onChange={setPBlockReason}
                  label="Select Reason"
                  required
                />
                <CustomButton
                  label={"Permanent Block Card"}
                  icon={<CreditCardOff />}
                  onClick={async () =>
                    await dispatch(
                      permanentBlockCardDetails({
                        reason: pBlockReason,
                        cardId: activeCard.cardid,
                        setCardLoading,
                        handleCloseCardModalActions,
                      })
                    )
                  }
                  isLoading={cardLoading}
                />
              </div>
            )}

            {activeCard.cardStatus === "suspended" && (
              <>
                <div className="fw-bold fs-7 text-danger px-5 text-center mt-5 pt-4">
                  No actions available for "Suspended" cards.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {program === "SMMACS0" ? (
        <>
          <div className="d-flex justify-content-center align-items-center flex-column gap-4 vh-60">
            <VpnLock className="text-dark" sx={{ fontSize: 65 }} />
            <h1 className="text-dark">Coming Soon!</h1>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between gap-3 pb-4">
            <h5>Manage Your Card(s)</h5>
            {cards.length > 0 && (
              <div
                className="d-flex align-items-center justify-content-end gap-2 me-5"
                onClick={openCardModal}
              >
                <CreditCard />
                <label htmlFor="" className="fs-7">
                  Add Card(s)
                </label>
              </div>
            )}
          </div>

          {cards.length > 0 ? (
            <div className="card-container">
              {cards.map((item, index) => (
                <CreditCardView
                  key={index}
                  item={item}
                  dispatch={dispatch}
                  handleOpen={() => openCardModalActions({ item })}
                />
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center gap-4 mx-auto mt-3">
              <img src="/credit-card.png" alt="" style={{ width: 450 }} />
              <label htmlFor="" style={{ width: 300, textAlign: "center" }}>
                Whoops! It looks like you haven't added any cards yet.
              </label>
              <CustomButton
                label={"Add Card(s)"}
                icon={<CreditCard />}
                onClick={() => openCardModal()}
                style={{ margin: "0 auto", width: 300 }}
              />
            </div>
          )}

          <CustomModal
            isOpen={isOpen}
            handleClose={handleCloseCardModal}
            children={<AddCardModalContent />}
            headerText={"Add Card(s)"}
            width={550}
          />

          <CustomModal
            isOpen={isOpenActions}
            handleClose={handleCloseCardModalActions}
            children={<ChangeCardModal />}
            headerText={"Modify your card details"}
            width={550}
          />
        </>
      )}
    </div>
  );
};

export default Cards;
