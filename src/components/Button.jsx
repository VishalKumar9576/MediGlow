function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer'

  const variants = {
    primary:
      'bg-violet-600 text-white hover:bg-violet-700',
    outline:
      'border border-[#00607a] text-[#00607a] bg-white',
    light:
      'bg-white text-slate-900 hover:bg-slate-100',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button