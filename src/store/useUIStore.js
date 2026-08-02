import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Modals
  addContactOpen: false,
  bulkImportOpen: false,
  templateEditorOpen: false,
  editingTemplateId: null,
  lowGlow: false,
  sidebarMobileOpen: false,

  // Selection
  selectedContactIds: [],
  selectedTemplateId: null,
  campaignContactFilter: '',

  setAddContactOpen: (v) => set({ addContactOpen: v }),
  setBulkImportOpen: (v) => set({ bulkImportOpen: v }),
  setTemplateEditorOpen: (open, id = null) =>
    set({ templateEditorOpen: open, editingTemplateId: id }),
  toggleLowGlow: () => set((s) => ({ lowGlow: !s.lowGlow })),
  setSidebarMobileOpen: (v) => set({ sidebarMobileOpen: v }),
  toggleSidebarMobile: () => set((s) => ({ sidebarMobileOpen: !s.sidebarMobileOpen })),

  setSelectedContactIds: (ids) => set({ selectedContactIds: ids }),
  toggleContactId: (id) =>
    set((s) => ({
      selectedContactIds: s.selectedContactIds.includes(id)
        ? s.selectedContactIds.filter((x) => x !== id)
        : [...s.selectedContactIds, id],
    })),
  clearSelectedContacts: () => set({ selectedContactIds: [] }),
  selectAllContacts: (ids) => set({ selectedContactIds: ids }),

  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  setCampaignContactFilter: (v) => set({ campaignContactFilter: v }),
}));
