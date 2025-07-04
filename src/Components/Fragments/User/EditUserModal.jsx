import React, { useEffect, useState } from "react";
import EditUserForm from "./EditUserForm";
import ModalResponse from "../Common/ModalResponse";

const EditUserModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseType, setResponseType] = useState("success");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSuccess = () => {
    setResponseType("success");
    setResponseMessage(
      "Pengguna berhasil diperbarui! Data akan diperbarui secara otomatis."
    );
    setShowResponseModal(true);
  };

  const handleError = (error) => {
    setResponseType("error");
    setResponseMessage(
      error || "Terjadi kesalahan saat memperbarui pengguna. Silakan coba lagi."
    );
    setShowResponseModal(true);
  };

  const handleResponseConfirm = () => {
    setShowResponseModal(false);
    if (responseType === "success") {
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 300);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={handleBackdropClick}
      >
        <div className="flex min-h-screen w-full items-center justify-center p-4 sm:min-h-0 sm:p-6">
          <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <EditUserForm
                user={user}
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={onClose}
                isModal={true}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalResponse
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        onConfirm={handleResponseConfirm}
        type={responseType}
        message={responseMessage}
        showCountdown={responseType === "success"}
        countdownSeconds={3}
      />
    </>
  );
};

export default EditUserModal;
