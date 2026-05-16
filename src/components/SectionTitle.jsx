function SectionTitle({ title, actionText, actionLink = '#' }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold text-black md:text-2xl">
        {title}
      </h2>

      {actionText && (
        <a
          href={actionLink}
          className="text-sm font-semibold text-violet-600 hover:text-violet-700"
        >
          {actionText}
        </a>
      )}
    </div>
  )
}

export default SectionTitle