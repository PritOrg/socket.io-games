import Swal from 'sweetalert2';

export const showSwal = ({ title, text, icon = 'info', timer, confirmText, showConfirmButton = true }) => {
  return Swal.fire({
    title,
    text,
    icon,
    timer,
    showConfirmButton,
    confirmButtonText: confirmText || 'OK',
    confirmButtonColor: '#3b82f6',
    background: 'rgba(255, 255, 255, 0.95)',
    backdrop: `
      rgba(0, 0, 0, 0.3)
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(200, 200, 200, 0.03) 10px,
        rgba(200, 200, 200, 0.03) 20px
      )
      center top
      no-repeat
    `,
    customClass: {
      popup: 'glass rounded-3xl border-2 border-blue-200/50',
      title: 'hand-drawn text-3xl text-blue-600',
      htmlContainer: 'paper-font text-gray-600 text-lg',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105'
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    allowEscapeKey: false
  });
};

export const showError = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonColor: '#ef4444',
    customClass: {
      popup: 'glass rounded-3xl',
      title: 'hand-drawn text-2xl text-red-500',
      confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold'
    },
    buttonsStyling: false
  });
};

export const showSuccess = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonColor: '#22c55e',
    customClass: {
      popup: 'glass rounded-3xl',
      title: 'hand-drawn text-3xl text-green-600',
      confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold'
    },
    buttonsStyling: false,
    timer: 2000,
    showConfirmButton: false
  });
};

export const showWaiting = (title, message) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'info',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'glass rounded-3xl',
      title: 'hand-drawn text-xl text-blue-500',
      loader: 'text-blue-500'
    }
  });
};

export const showInput = async (title, placeholder, confirmText = 'Join') => {
  const { value } = await Swal.fire({
    title,
    input: 'text',
    inputPlaceholder: placeholder,
    inputAttributes: {
      class: 'paper-font text-lg text-center uppercase tracking-wider'
    },
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    background: 'rgba(255, 255, 255, 0.95)',
    customClass: {
      popup: 'glass rounded-3xl',
      title: 'hand-drawn text-2xl text-blue-600',
      input: 'glass border-2 border-blue-200 rounded-xl px-4 py-3 text-center',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-bold',
      cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-bold'
    },
    buttonsStyling: false
  });
  return value;
};

export const showConfirm = async (title, message, confirmText = 'Yes', cancelText = 'Cancel') => {
  const { isConfirmed } = await Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    background: 'rgba(255, 255, 255, 0.95)',
    customClass: {
      popup: 'glass rounded-3xl',
      title: 'hand-drawn text-2xl text-blue-600',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-bold',
      cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-bold'
    },
    buttonsStyling: false
  });
  return isConfirmed;
};

export const showRoomCreated = async (roomId, gameName = 'Game') => {
  let copied = false;
  
  const result = await Swal.fire({
    title: '🎉 Room Created!',
    html: `
      <div class="flex flex-col items-center gap-4">
        <p class="paper-font text-gray-600">Share this code with your friend:</p>
        <div class="flex items-center gap-2">
          <div class="bg-blue-100 px-6 py-3 rounded-xl border-2 border-blue-300">
            <span class="text-3xl font-bold text-blue-600 tracking-widest">${roomId}</span>
          </div>
          <button id="copy-btn" class="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <p id="copy-text" class="text-green-600 text-sm font-bold hidden">✓ Copied!</p>
      </div>
    `,
    confirmButtonText: 'Ready!',
    confirmButtonColor: '#22c55e',
    background: 'rgba(255, 255, 255, 0.95)',
    customClass: {
      popup: 'glass rounded-3xl',
      title: 'hand-drawn text-3xl text-green-600',
      confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold'
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    didOpen: () => {
      const copyBtn = document.getElementById('copy-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(roomId);
        copied = true;
        document.getElementById('copy-text').classList.remove('hidden');
        setTimeout(() => {
          document.getElementById('copy-text').classList.add('hidden');
        }, 2000);
      });
    }
  });
  
  return result.isConfirmed;
};