import type { ReactNode } from 'react';

interface IconButtonProps {
  colorClassName?: string;
  disabled?: boolean;
  icon: ReactNode;
  onClick: () => void;
  title?: string;
}

function IconButton({
  colorClassName = '',
  disabled = false,
  icon,
  onClick,
  title,
}: IconButtonProps) {
  return (
    <button
      className={`cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${colorClassName}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );
}

export default IconButton;
