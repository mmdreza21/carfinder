"use client";

import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classnames from "classnames";

const LINKS = [
  { label: "Elasticsearch", href: "/" },
  { label: "Postgres",      href: "/simple-search" },
];

const NavLinks = () => {
  const pathname = usePathname();
  return (
    <Flex gap="4" align="center" className="nav-links">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={classnames("nav-link", { "nav-link-active": active })}
          >
            {link.label}
          </Link>
        );
      })}
    </Flex>
  );
};

export default NavLinks;
