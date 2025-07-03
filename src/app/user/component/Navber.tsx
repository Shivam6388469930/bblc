"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/user/about" },
  { name: "Service", href: "/service" },
  { name: "Contact", href: "/contact" },
  { name: "Pay Fees", href: "/unified-payment" },
  { name: "Attendance", href: "/attendance" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [userImage, setUserImage] = useState("/avter.png");
  const [userName, setUserName] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const img = localStorage.getItem("Image");
    const name = localStorage.getItem("userName");

    setUserImage(
      img && (img.startsWith("http") || img.startsWith("/")) ? img : "/avter.png"
    );
    setUserName(name || "");
    setHasMounted(true);
  }, []);

  const handleSignOut = () => {
    if (!localStorage.getItem("token")) {
      alert("User is not logged in");
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  if (!hasMounted) return null;

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 w-full z-10">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">

              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white">
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </DisclosureButton>
              </div>

              {/* Logo Section */}
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center space-x-4 pr-16">
                  <Image
                    src="/heroimg/Untitled_design-removebg-preview (1).png"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                  <div className="leading-tight">
                    <p className="font-bold text-indigo-600 text-lg">BBLC</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Baba Bamokhar Library Centre
                    </p>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex justify-center space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname.startsWith(item.href)
                          ? "text-indigo-600 font-semibold"
                          : "text-gray-600 hover:text-indigo-600",
                        "text-lg"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                {/* User Menu */}
                <div className="flex items-center ml-auto pr-2">
                  <Menu as="div" className="relative ml-3">
                    <MenuButton
                      aria-label="User menu"
                      title={userName || "Guest"}
                      className="flex rounded-full text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <Image
                        src={userImage}
                        alt="User"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    </MenuButton>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5">
                      {!userName ? (
                        <>
                          <MenuItem>
                            {({ active }) => (
                              <a
                                href="/register"
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                )}
                              >
                                Sign Up
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <a
                                href="/login"
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                )}
                              >
                                Sign In
                              </a>
                            )}
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem>
                            {({ active }) => (
                              <a
                                href="/history"
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                )}
                              >
                                Registration History
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <a
                                href="/monthly-history"
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                )}
                              >
                                Monthly Fee History
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <a
                                href="/profile"
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={handleSignOut}
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                )}
                              >
                                Sign Out
                              </button>
                            )}
                          </MenuItem>
                        </>
                      )}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <DisclosurePanel className="sm:hidden transition-all duration-300 ease-in-out">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname.startsWith(item.href)
                      ? "bg-gray-200 text-indigo-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600",
                    "block rounded-md px-3 py-2 text-base"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
