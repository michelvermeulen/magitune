import {
  TInput,
  TButton,
  TAlert,
  TModal,
  TCheckbox,
  TToggle
} from 'vue-tailwind/dist/components';

export default
  {
    't-input': {
      component: TInput,
      props: {
        classes: 'block w-full px-3 py-3 text-black dark:text-slate-300 placeholder-gray-400 transition duration-100 ease-in-out bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed'
      }
    },
    't-toggle': {
      component: TToggle,
      props: {
        classes: {
          wrapper: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          wrapperChecked: 'bg-blue-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          wrapperDisabled: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          wrapperCheckedDisabled: 'bg-blue-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          button: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-gray-400 text-xs',
          buttonChecked: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-blue-500 text-xs',
          checkedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs',
          uncheckedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs',
        },
        fixedClasses: {
          wrapper: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200',
          wrapperChecked: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200',
          wrapperDisabled: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200 opacity-50 cursor-not-allowed',
          wrapperCheckedDisabled: 'relative inline-flex flex-shrink-0 cursor-pointer transition-colors ease-in-out duration-200 opacity-50 cursor-not-allowed',
          button: 'inline-block absolute transform translate-x-0 transition ease-in-out duration-200',
          buttonChecked: 'inline-block absolute transform translate-x-full transition ease-in-out duration-200',
          checkedPlaceholder: 'inline-block',
          uncheckedPlaceholder: 'inline-block',
        }
      }
    },
    't-modal': {
      component: TModal,
      props: {
        fixedClasses: {
          overlay: 'z-40 overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-opacity-50',
          wrapper: 'relative mx-auto z-50 max-w-lg px-3 py-12',
          modal: 'overflow-visible relative rounded',
          body: 'p-3',
          header: 'rounded-t',
          footer: ' p-3 rounded-b',
          close: 'flex items-center justify-center rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50'
        },
        classes: {
          overlay: 'bg-black',
          wrapper: '',
          modal: 'bg-slate-800 shadow',
          body: 'p-3',
          header: 'bg-slate-800',
          footer: 'bg-slate-800',
          close: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          closeIcon: 'fill-current h-4 w-4',
          overlayEnterClass: 'opacity-0',
          overlayEnterActiveClass: 'transition ease-out duration-100',
          overlayEnterToClass: 'opacity-100',
          overlayLeaveClass: 'opacity-100',
          overlayLeaveActiveClass: 'transition ease-in duration-75',
          overlayLeaveToClass: 'opacity-0',
          enterClass: '',
          enterActiveClass: '',
          enterToClass: '',
          leaveClass: '',
          leaveActiveClass: '',
          leaveToClass: ''
        },
        variants: {
          danger: {
            overlay: 'bg-red-100',
            header: 'border-red-50 text-red-700',
            close: 'bg-red-50 text-red-700 hover:bg-red-200 border-red-100 border',
            modal: 'bg-white border border-red-100 shadow-lg',
            footer: 'bg-red-50'
          }
        }
      }
    },
    't-alert': {
      component: TAlert,
      props: {
        fixedClasses: {
          wrapper: 'relative flex items-center p-4 border-l-4  rounded shadow-sm',
          body: 'flex-grow',
          close: 'absolute relative flex items-center justify-center ml-4 flex-shrink-0 w-6 h-6 transition duration-100 ease-in-out rounded focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
          closeIcon: 'fill-current h-4 w-4'
        },
        classes: {
          wrapper: 'bg-blue-50 border-blue-500',
          body: 'text-blue-700',
          close: 'text-blue-500 hover:bg-blue-200'
        },
        variants: {
          danger: {
            wrapper: 'bg-red-50 border-red-500',
            body: 'text-red-700',
            close: 'text-red-500 hover:bg-red-200'
          },
          success: {
            wrapper: 'bg-green-50 border-green-500',
            body: 'text-green-700',
            close: 'text-green-500 hover:bg-green-200'
          }
        }
      }
    },
    't-button': {
      component: TButton,
      props: {
        // The fixed classes will never change and will be merged with the `classes` value or the active variant
        fixedClasses: 'flex align-center justify-center text-white border border-transparent shadow-sm rounded',
        // Classes used when any variant is active
        classes: 'transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        variants: {
          primary: 'px-4 py-3  bg-blue-800 ring:0',
          secondary: 'px-4 py-3  bg-slate-800 hover:bg-slate-800 ring:0',
          // A red variant of the button (applied when `<t-button variant="error" />`)
          error: 'px-4 py-3  text-white bg-red-600 hover:bg-red-500 focus:border-red-700 active:bg-red-700 text-sm font-medium border border-transparent px-3 rounded-md',
          // A green variant of the button (applied when `<t-button variant="success" />`)
          success: 'px-4 py-3  text-white bg-green-600 hover:bg-green-500 focus:border-green-700 active:bg-green-700 text-sm font-medium border border-transparent px-3 rounded-md',
          // ...unlimited variants
        }
        // ...More settings
      }
    },
    't-checkbox': {
      component: TCheckbox,
      props: {
        wrapper: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        wrapperChecked: 'bg-blue-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        wrapperDisabled: 'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        wrapperCheckedDisabled: 'bg-blue-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        button: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-gray-400 text-xs',
        buttonChecked: 'h-5 w-5 rounded-full bg-white shadow flex items-center justify-center text-blue-500 text-xs',
        checkedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs',
        uncheckedPlaceholder: 'rounded-full w-5 h-5 flex items-center justify-center text-gray-400 text-xs',
      }
    },
  }
