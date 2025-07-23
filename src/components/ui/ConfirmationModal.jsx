const MODAL_OVERLAY_CLASSES = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
const MODAL_CONTAINER_CLASSES = 'bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 ease-out scale-100 opacity-100';
const MODAL_TITLE_CLASSES = 'text-xl font-semibold text-gray-900 mb-4';
const MODAL_MESSAGE_CLASSES = 'text-gray-700 mb-6';
const BUTTON_CONTAINER_CLASSES = 'flex justify-end space-x-3';
const CANCEL_BUTTON_CLASSES = 'px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors';
const CONFIRM_BUTTON_CLASSES = 'px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={MODAL_OVERLAY_CLASSES}>
      <div className={MODAL_CONTAINER_CLASSES}>
        <h3 className={MODAL_TITLE_CLASSES}>Confirm Action</h3>
        <p className={MODAL_MESSAGE_CLASSES}>{message}</p>
        <div className={BUTTON_CONTAINER_CLASSES}>
          <button
            onClick={onCancel}
            className={CANCEL_BUTTON_CLASSES}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={CONFIRM_BUTTON_CLASSES}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;