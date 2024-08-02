"use client";
import React, {  useState } from "react";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Button, MenuItem } from "@mui/material";
import {Menu as MuiMenu} from '@mui/material/';

const navigation = [
  { name: "Dashboard", href: "/admin" , role: "login"},
  // { name: 'Council', href: '/admin/councilMan' },
  { name: "Bin management", href: "/admin/binMan" ,role: "admin"},
  { name: "Classification", href: "/admin/classification" , role:"admin"},
  { name: "Special recycling", href: "/admin/collection" , role:"admin"},
  { name: "Item management", href: "/admin/itemMan" ,role: "superadmin"},
  { name: "Community", href: "/admin/community" , role:"superadmin"},
  //{ name: "Council Photo", href: "/admin/councilSettings" ,role: "superadmin"},
  //{ name: 'Users', href: '/admin/userMan',role:"superadmin" },

];

const settingsNav = [
  { name: "Council Photo", href: "/admin/councilSettings" ,role: "admin"},
  { name: 'Users', href: '/admin/userMan',role:"superadmin" },
  {name:"Notifications",href:'/admin/notificationsMan',role:"admin"},
  {name:"Bin Days and Collection",href:'/admin/binCalendar',role:"admin"}
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ user }: { user?: any }) {
  const pathname = usePathname();

  const [role,setRole] = useState(user.role);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isopen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className=""
                    src="/images/logo.jpg"
                    height={32}
                    width={60}
                    alt={`logo avatar`}
                  />
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  { role === "ADMIN" &&
                  
                  navigation.filter((m) => m.role === "admin").map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? "border-slate-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      )}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                  { role === "SUPERADMIN" &&
                  
                  navigation.filter((m) => m.role !== "login").map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? "border-slate-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      )}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className={classNames("border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",)}>
                  <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  className="border-slate-500 text-gray-900"
                  style={{"textTransform":"capitalize"}}
                >
                  Management
                </Button>
                <MuiMenu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={isopen}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {role=="ADMIN" && 
                   settingsNav.filter((m) => m.role === "admin").map((item) => (
                    <MenuItem onClick={handleClose} key={item.name}>
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? "border-slate-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      )}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                    </MenuItem>
                  ))}

                  {role=="SUPERADMIN" && 
                   settingsNav.filter((m) => m.role !== "login").map((item) => (
                    <MenuItem onClick={handleClose} key={item.name}>
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? "border-slate-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      )}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                    </MenuItem>
                  ))}
                </MuiMenu>
                  </div>
                  
                </div>
              </div>

              <div className="text-sm ml-6 font-medium text-gray-500">
                  Welcome! {user.email}
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={
                          user?.image ||
                          "/images/city_council_avatar_sample.png"
                        }
                        height={32}
                        width={32}
                        alt={`${user?.name || "placeholder"} avatar`}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user ? (
                        <Menu.Item>
                          {({ active }) => (
                            <form action="/api/auth/sign-out" method="post">
                              <button
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "flex w-full px-4 py-2 text-sm text-gray-700",
                                )}
                              >
                                Sign out
                              </button>
                            </form>
                          )}
                        </Menu.Item>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "flex w-full px-4 py-2 text-sm text-gray-700",
                              )}
                              onClick={() =>
                                (window.location.href = "/admin/login")
                              }
                            >
                              Sign in
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? "bg-slate-50 border-slate-500 text-slate-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {user ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.image}
                        height={32}
                        width={32}
                        alt={`${user.name} avatar`}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <form action="/api/auth/sign-out" method="post">
                      <button className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                        Sign out
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => (window.location.href = "admin/login")}
                    className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
