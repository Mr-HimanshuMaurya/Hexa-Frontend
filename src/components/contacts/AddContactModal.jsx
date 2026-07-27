import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCreateContact } from '../../api/contacts';

export default function AddContactModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const createContact = useCreateContact();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact.mutateAsync({
        email,
        name,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      toast.success('Contact added');
      setEmail('');
      setName('');
      setTags('');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="user@example.com"
        />
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Optional"
        />
        <Input
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="leads, newsletter"
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" loading={createContact.isPending}>
            Add
          </Button>
        </div>
      </form>
    </Modal>
  );
}
