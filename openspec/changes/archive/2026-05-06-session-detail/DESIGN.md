# Technical Design: Session Detail Drawer & Attachments

## Data Model Updates

### [MODIFY] `Session` (types/index.ts)
```ts
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string; // Base64 for local persistence
}

export interface Session {
  // ... existing fields
  notes?: string;
  attachments?: Attachment[];
}
```

## Component Architecture

### `SessionDrawer.tsx` [NEW]
- **Props**: `session: Session | null`, `onClose: () => void`.
- **Layout**:
  - `Overlay`: Semi-transparent background to dim the list.
  - `Panel`: `fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl`.
- **Sections**:
  - **Header**: Description title + Close button.
  - **Time Info**: Nice grid with "Start", "End", and "Duration".
  - **Notes**: A `textarea` that expands to fill available space or has a fixed min-height. Uses `useAppStore.updateSession`.
  - **Attachments**: 
    - `FileDropzone`: Clickable area to add files.
    - `AttachmentGrid`: List of thumbnails with delete buttons.

## Store Actions

### [NEW] `addAttachment(sessionId: string, file: File)`
- Converts file to base64.
- Adds to `session.attachments`.

### [NEW] `removeAttachment(sessionId: string, attachmentId: string)`
- Filters out the attachment.

## UX Details
- **Auto-save**: Notes should save on blur or with a short debounce.
- **Image Preview**: Clicking an attachment thumbnail opens a simple lightbox/full-size view.
- **Animations**: Use `translate-x-full` to `translate-x-0` with a smooth transition.

## Storage Considerations
> [!WARNING]
> LocalStorage has a limit (~5MB). Storing many base64 images will fill it up quickly. 
> For the MVP, we will:
> 1. Limit file size to 1MB per attachment.
> 2. Recommend clearing old sessions if storage is full.
