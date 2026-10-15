"use client";

import { Container, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import Link from "next/link";
import { AiOutlineCar, AiOutlineBulb } from "react-icons/ai";
import { BsMoonStars, BsSun } from "react-icons/bs";
import NavLinks from "./components/NavLinks";
import { useAppearance } from "./providers/ThemeProvider";

const NavBar = () => {
  const { appearance, toggle } = useAppearance();
  const isDark = appearance === "dark";

  return (
    <nav className="site-nav mb-6 px-4 py-3 sm:px-5">
      <Container>
        <Flex justify="between" align="center" width="100%">
          <Flex align="center" gap="4">
            <Link href="/" className="brand-link" aria-label="CarFinder home">
              <span className="brand-mark">
                <AiOutlineCar />
              </span>
              <span>
                <Text as="span" weight="bold" size="3">CarFinder</Text>
                <Text as="span" size="1" className="brand-subtitle">car discovery</Text>
              </span>
            </Link>
            <NavLinks />
          </Flex>

          <Flex align="center" gap="3">
            <AiOutlineBulb style={{ opacity: 0.5 }} aria-hidden />
            <Tooltip content={isDark ? "Switch to light" : "Switch to dark"}>
              <IconButton
                variant="soft"
                color="gray"
                radius="full"
                onClick={toggle}
                aria-label="Toggle theme"
              >
                {isDark ? <BsSun /> : <BsMoonStars />}
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
