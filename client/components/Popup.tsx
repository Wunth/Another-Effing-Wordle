// A reusable popup/modal — pass it content as children, control visibility with isOpen
function Popup({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  // Don't render anything at all if it's closed
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      // Clicking the dark background closes the popup
      onClick={onClose}
    >
      <div
        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white"
        role="dialog"
        aria-modal="true"
        // Stop clicks inside the popup from closing it (only the background should)
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="mb-2 float-right text-gray-500 hover:text-gray-800 dark:text-gray-300"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export default Popup
