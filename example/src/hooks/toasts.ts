import { createUseToastsHook } from 'awesome-toasts';

import { Toast } from '../components/toast';

export const useToasts = createUseToastsHook<typeof Toast>();
