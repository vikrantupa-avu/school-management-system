import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, title = 'Confirm action', message, onCancel, onConfirm }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      )}
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
