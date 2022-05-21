import toast from 'react-hot-toast';
import { getBestErrorMessage } from './getBestErrorMessage';

export class ToastService {
  static success(message: string | {content: string, header: string}) {
    // TODO deal with {  content, header };
    return toast.success(message as string, {
      style: {
        boxShadow: '0 3px 8px rgba(0,0,0,0.175)',
        padding: '4px 8px',
        fontSize: '12px',
        borderRadius: '10px',
        background: '#E3FCEF',
        color: '#006644',
      },
      iconTheme: {
        primary: '#E3FCEF',
        secondary: '#006644',
      },
      duration: 3000,
    });
  }

  // TODO clean up
  static error(message: unknown) {
    return toast.error(getBestErrorMessage(message), {
      style: {
        boxShadow: '0 3px 8px rgba(0,0,0,0.175)',
        padding: '4px 8px',
        fontSize: '12px',
        borderRadius: '10px',
        // background: '#E3FCEF',
        // color: '#006644',
      },
      // iconTheme: {
      //   // primary: '#E3FCEF',
      //   // secondary: '#006644',
      // },
      duration: 3000,
    });
  }
}
