import React, { useState, useEffect } from 'react';
import { Phone, Plus, X, Pencil, Trash } from 'phosphor-react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const CrisisHelp = ({ isOpen: externalIsOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customNumbers, setCustomNumbers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const toast = useToast();
  const { getCardStyle } = useTheme();

  // Default emergency numbers
  const defaultNumbers = [
    {
      id: 'emergency',
      name: 'Emergency',
      phone: '115',
      isDefault: true,
    },
    {
      id: 'depression',
      name: 'Depression Hotline',
      phone: '1900 1267',
      isDefault: true,
    },
  ];

  useEffect(() => {
    // Load custom numbers from localStorage
    const saved = localStorage.getItem('crisisCustomNumbers');
    if (saved) {
      try {
        setCustomNumbers(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading custom numbers:', e);
      }
    }
  }, []);

  const saveCustomNumbers = (numbers) => {
    localStorage.setItem('crisisCustomNumbers', JSON.stringify(numbers));
    setCustomNumbers(numbers);
  };

  const handleCall = (phone, name) => {
    if (window.confirm(`Call ${name}?\nPhone: ${phone}`)) {
      window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    }
  };

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.warning('Please fill in all fields');
      return;
    }

    const newNumber = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      isDefault: false,
    };

    const updated = [...customNumbers, newNumber];
    saveCustomNumbers(updated);
    setFormData({ name: '', phone: '' });
    setShowAddModal(false);
    toast.success('Phone number added');
  };

  const handleEdit = (id) => {
    const number = customNumbers.find(n => n.id === id);
    if (number) {
      setFormData({ name: number.name, phone: number.phone });
      setEditingId(id);
      setShowAddModal(true);
    }
  };

  const handleUpdate = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.warning('Please fill in all fields');
      return;
    }

    const updated = customNumbers.map(n =>
      n.id === editingId
        ? { ...n, name: formData.name.trim(), phone: formData.phone.trim() }
        : n
    );
    saveCustomNumbers(updated);
    setFormData({ name: '', phone: '' });
    setEditingId(null);
    setShowAddModal(false);
    toast.success('Phone number updated');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this number?')) {
      const updated = customNumbers.filter(n => n.id !== id);
      saveCustomNumbers(updated);
      toast.success('Phone number deleted');
    }
  };

  const allNumbers = [...defaultNumbers, ...customNumbers];

  // Sync with external isOpen prop
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-primary"
            style={getCardStyle()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Emergency Help</h2>
                  <p className="text-sm opacity-90 mt-1">You're not alone. Help is available right now. 💙</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {allNumbers.map((number) => (
                <div
                  key={number.id}
                  className="heal-card p-4 border border-primary hover:border-red-300 hover:shadow-md transition-all rounded-xl"
                  style={getCardStyle()}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-primary mb-1">{number.name}</h3>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{number.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCall(number.phone, number.name)}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        aria-label={`Call ${number.name}`}
                      >
                        <Phone size={20} fill="currentColor" />
                      </button>
                      {!number.isDefault && (
                        <>
                          <button
                            onClick={() => handleEdit(number.id)}
                            className="w-10 h-10 rounded-full bg-tertiary hover:bg-elevated text-secondary hover:text-primary flex items-center justify-center transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(number.id)}
                            className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                            aria-label="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Custom Number Button */}
              <button
                onClick={() => {
                  setFormData({ name: '', phone: '' });
                  setEditingId(null);
                  setShowAddModal(true);
                }}
                className="w-full heal-card p-4 border-2 border-dashed border-primary hover:border-[#5E8B7E] transition-all flex items-center justify-center gap-2 text-secondary hover:text-[#5E8B7E] rounded-xl"
                style={getCardStyle()}
              >
                <Plus size={20} />
                <span className="font-semibold">Add Custom Number</span>
              </button>
            </div>

            {/* Footer with trust signals */}
            <div 
              className="p-6 border-t border-primary"
              style={getCardStyle()}
            >
              <div className="space-y-3">
                <p className="text-sm text-primary text-center font-medium leading-relaxed">
                  💙 You're not alone. These numbers are here 24/7, and someone is always ready to listen and help.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-secondary">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Confidential</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Free Support</span>
                  </div>
                </div>
                <p className="text-xs text-secondary text-center italic mt-2">
                  Your privacy is protected. We don't track or store any information about your calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setShowAddModal(false);
            setEditingId(null);
            setFormData({ name: '', phone: '' });
          }}
        >
          <div
            className="rounded-2xl shadow-2xl w-full max-w-md p-6 border border-primary"
            style={getCardStyle()}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-primary mb-6">
              {editingId ? 'Edit Phone Number' : 'Add New Phone Number'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Therapist, Counseling Hotline..."
                  className="w-full px-4 py-3 bg-tertiary border border-primary rounded-xl text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#5E8B7E]/20 focus:border-[#5E8B7E] transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 1900xxxx, 0912xxxxxx..."
                  className="w-full px-4 py-3 bg-tertiary border border-primary rounded-xl text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[#5E8B7E]/20 focus:border-[#5E8B7E] transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    setFormData({ name: '', phone: '' });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-secondary bg-tertiary hover:bg-elevated transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#5E8B7E] to-[#4a7a6d] hover:from-[#4a7a6d] hover:to-[#5E8B7E] transition-all"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const openCrisisHelp = () => {
};

export default CrisisHelp;

