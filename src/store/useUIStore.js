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

  setSelectedContactIds: (ids) => set({ selectedContactIds: [...new Set(ids)] }),
  toggleContactId: (id) =>
    set((s) => ({
      selectedContactIds: s.selectedContactIds.includes(id)
        ? s.selectedContactIds.filter((x) => x !== id)
        : [...s.selectedContactIds, id],
    })),
  clearSelectedContacts: () => set({ selectedContactIds: [] }),
  selectMultiple: (ids) =>
    set((s) => ({
      selectedContactIds: [...new Set([...s.selectedContactIds, ...ids])],
    })),
  deselectMultiple: (ids) =>
    set((s) => {
      const remove = new Set(ids);
      return {
        selectedContactIds: s.selectedContactIds.filter((id) => !remove.has(id)),
      };
    }),
  /** @deprecated use selectMultiple — kept for CampaignCreate merge behavior */
  selectAllContacts: (ids) => set({ selectedContactIds: [...new Set(ids)] }),

  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  setCampaignContactFilter: (v) => set({ campaignContactFilter: v }),
}));
