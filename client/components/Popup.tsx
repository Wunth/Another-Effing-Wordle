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
        // Matches the header's glassy dark background style
        className="rounded-lg bg-gray-500/30 backdrop-blur-sm text-green-600 p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        // Stop clicks inside the popup from closing it (only the background should)
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="mb-2 float-right text-green-600 hover:opacity-75"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export default Popup
