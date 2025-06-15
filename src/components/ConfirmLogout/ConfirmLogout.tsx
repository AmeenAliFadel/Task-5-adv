// ConfirmLogout.tsx
import './ConfirmLogout.css';

export default function ConfirmLogout({
    onConfirm,
    onCancel
}: {
    onConfirm: () => void;
    onCancel: () => void;

},

) {
    return (
        <div className="modal-overlay d-flex justify-content-center align-items-center ">
            <div className="modal-box p-5 rounded text-center">
                <p className="modal-text mb-4">ARE YOU SURE YOU WANT TO LOG OUT?</p>
                <div className="modal-buttons d-flex justify-content-center">
                    <button className="modal-btn border-0 rounded" onClick={onConfirm}>Yes</button>
                    <button className="modal-btn border-0 rounded" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
}
