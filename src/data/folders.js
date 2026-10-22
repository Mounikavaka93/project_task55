import { Archive, FileText, Inbox, Send, ShieldAlert, Star, Trash2 } from 'lucide-react'

export const FOLDERS = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    emptyTitle: 'Inbox zero, for now',
    emptyBody: 'New mail will land here. You can also start a message of your own.',
  },
  {
    id: 'starred',
    label: 'Starred',
    icon: Star,
    emptyTitle: 'No starred mail',
    emptyBody: 'Star a message to pin it here without taking it out of its folder.',
  },
  {
    id: 'sent',
    label: 'Sent',
    icon: Send,
    emptyTitle: 'Nothing sent yet',
    emptyBody: 'Messages you send are kept here.',
  },
  {
    id: 'drafts',
    label: 'Drafts',
    icon: FileText,
    emptyTitle: 'No drafts saved',
    emptyBody: 'Start a message and choose Save draft to finish it later.',
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: Archive,
    emptyTitle: 'Archive is clear',
    emptyBody: 'Archived messages leave the inbox and stay available here.',
  },
  {
    id: 'spam',
    label: 'Spam',
    icon: ShieldAlert,
    emptyTitle: 'No spam',
    emptyBody: 'Messages you mark as spam are held in this folder.',
  },
  {
    id: 'trash',
    label: 'Trash',
    icon: Trash2,
    emptyTitle: 'Trash is empty',
    emptyBody: 'Deleted messages wait here until you restore them or remove them for good.',
  },
]
