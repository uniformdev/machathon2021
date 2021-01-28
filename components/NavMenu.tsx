import Link from 'next/link';

const NavMenu = ({
  isScrolled,
  submenuVisible,
}: {
  isScrolled: boolean;
  submenuVisible: boolean;
}) => {
  let anchorClass = 'inline-block no-underline  hover:underline py-2 px-4';
  if (!submenuVisible && !isScrolled) {
    anchorClass += ' text-white';
  } else {
    anchorClass += ' text-gray-800';
  }

  return (
    <ul className="list-reset lg:flex justify-end flex-1 items-center space-x-2 lg:mr-4">
      <li>
        <Link href="/[[...slug]]" as="/developers/">
          <a className={anchorClass}>For Developers</a>
        </Link>
      </li>
      <li>
        <Link href="/[[...slug]]" as="/marketers/">
          <a className={anchorClass}>For Marketers</a>
        </Link>
      </li>
      <li>
        <Link href="/[[...slug]]" as="/talks/">
          <a className={anchorClass}>Sessions</a>
        </Link>
      </li>
      <li>
        <Link href="/[[...slug]]" as="/registration/">
          <a className={anchorClass}>Registration</a>
        </Link>
      </li>
      <li>
        <Link href="/[[...slug]]" as="/shop">
          <a className={anchorClass}>Shop</a>
        </Link>
      </li>
    </ul>
  );
};

export default NavMenu;
