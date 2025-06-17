import './ConfirmPopup.css';

interface ConfirmPopupProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;  // Optional loading property
}

export default function ConfirmPopup({
    message,
    onConfirm,
    onCancel,
    loading = false,  // Default value is false
}: ConfirmPopupProps) {
    return (
        <div className="modal-overlay d-flex justify-content-center align-items-center">
            <div className="modal-box p-5 rounded text-center">
                <p className="modal-text mb-4">{message}</p>
                <div className="modal-buttons d-flex justify-content-between">
                    <button
                        className="modal-btn border-0 rounded"
                        onClick={onConfirm}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            // You can use a simple spinner or text
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Yes'
                        )}
                    </button>
                    <button
                        className="modal-btn border-0 rounded"
                        onClick={onCancel}
                        disabled={loading} // Disable button while loading
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
