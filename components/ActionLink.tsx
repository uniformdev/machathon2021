export const ActionLink = ({
  label,
  href,
  onClick
}: {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  href: string;
}) => (
  <a
    href={href}
    onClick={onClick}
    className="flex items-center justify-center mx-auto lg:mx-0 hover:underline font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 gradient text-white"
  >
    <span className="pointer-events-none">{label}</span>
    <svg
      className="h-5 w-5 mx-2 pointer-events-none"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </a>
);
