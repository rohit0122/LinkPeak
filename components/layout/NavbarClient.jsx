"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  RiMenuLine,
  RiCloseLine,
  RiLogoutBoxRLine,
  RiLinksLine,
  RiExternalLinkLine,
  RiSparklingLine,
  RiPlayCircleLine,
  RiPriceTag3Line,
  RiQuestionLine,
  RiLayoutMasonryLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiAddCircleLine,
  RiStackLine,
  RiFlashlightLine,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import { CONFIG } from "@/constants/config";
import Logo from "./Logo";
import Avatar from "@/components/shared/Avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

const publicLinks = [
  {
    name: "Features",
    href: "/#features",
    icon: <RiStackLine size={24} />,
    color: "text-primary",
  },
  {
    name: "Why Different",
    href: "/why-different",
    icon: <RiFlashlightLine size={24} />,
    color: "text-secondary",
  },
  {
    name: "Demo",
    href: "/#demo",
    icon: <RiPlayCircleLine size={24} />,
    color: "text-info",
  },
  {
    name: "Fair Pricing",
    href: "/#pricing",
    icon: <RiPriceTag3Line size={24} />,
    color: "text-warning",
  },
  {
    name: "FAQ",
    href: "/#faq",
    icon: <RiQuestionLine size={24} />,
    color: "text-success",
  },
];

export default function NavbarClient({
  pages = [],
  onSelectPage,
  onCreatePage,
}) {
  // ✅ Zustand selectors (efficient)
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const currentPage = useAuthStore((state) => state.currentBioPage);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />

          {/* Agency Page Selector */}
          {isAuthenticated &&
            currentUser?.plan === "AGENCY" &&
            currentUser?.role !== "admin" && (
              <div className="dropdown dropdown-bottom">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-sm btn-ghost gap-2 font-bold normal-case text-base-content/80 hover:bg-base-200/50"
                >
                  <RiLayoutMasonryLine className="text-primary text-lg" />
                  <span className="hidden sm:inline-block max-w-[100px] truncate">
                    {currentPage?.slug ? `/${currentPage.slug}` : "Select Page"}
                  </span>
                  <RiArrowDownSLine className="opacity-40" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[60] menu p-2 shadow-2xl bg-base-100 w-64 mt-2 border border-base-200 rounded-box"
                >
                  <li className="menu-title px-4 py-2 my-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      My Bio Projects
                    </span>
                  </li>
                  {pages.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          onSelectPage && onSelectPage(p.id);
                          // Close dropdown by removing focus
                          document.activeElement?.blur();
                        }}
                        className={`flex items-center justify-between py-2.5 px-3 ${currentPage?.id === p.id
                          ? "bg-primary/10 text-primary font-bold my-1"
                          : ""
                          }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${currentPage?.id === p.id
                              ? "bg-primary"
                              : "bg-base-300"
                              }`}
                          ></div>
                          <span className="truncate text-xs">/{p.slug}</span>
                        </div>
                        {currentPage?.id === p.id && (
                          <RiCheckLine className="flex-shrink-0 text-xs" />
                        )}
                      </button>
                    </li>
                  ))}
                  {pages.length <
                    (
                      CONFIG.PLAN_LIMITS[currentUser?.plan] ||
                      CONFIG.PLAN_LIMITS.FREE
                    ).pages && (
                      <>
                        <div className="divider my-1 opacity-10"></div>
                        <li>
                          <button
                            onClick={() => {
                              onCreatePage();
                              // Close dropdown by removing focus
                              document.activeElement?.blur();
                            }}
                            className="flex items-center gap-3 py-2.5 px-3 text-primary font-bold hover:bg-primary/5 text-xs"
                          >
                            <RiAddCircleLine className="text-base flex-shrink-0" />
                            Create New Bio
                          </button>
                        </li>
                      </>
                    )}
                </ul>
              </div>
            )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Bio Button (Non-Admin) */}
          {isAuthenticated && currentUser?.role !== "admin" && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentPage?.slug) {
                    window.open(`/${currentPage.slug}`, "_blank");
                  } else {
                    toast.error("Please set a slug in Settings first!", {
                      icon: "🔗",
                    });
                  }
                }}
                className="group flex items-center gap-3 px-5 py-2.5 bg-info/5 hover:bg-info text-info-content hover:text-info-content transition-all duration-300 border border-info/20 hover:border-info shadow-sm hover:shadow-info/20"
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] uppercase font-bold">
                    View Live Bio
                  </span>
                  <span className="text-xs tracking-tight font-medium">
                    {currentPage?.slug ? `/${currentPage.slug}` : "not-set"}
                  </span>
                </div>
                <div className="p-1.5 bg-info/10 group-hover:bg-white/20 transition-colors">
                  <RiExternalLinkLine className="text-lg" />
                </div>
              </button>
            </div>
          )}

          {/* Profile Dropdown */}
          {isAuthenticated && (
            <ProfileDropdown
              currentUser={currentUser}
              page={currentPage}
              onLogout={handleLogout}
            />
          )}

          {/* Guest Navigation */}
          {!isAuthenticated && !loading && (
            <>
              <div className="hidden md:flex items-center gap-6">
                {publicLinks.map((l) => (
                  <Link key={l.name} href={l.href} className="font-medium">
                    {l.name}
                  </Link>
                ))}
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="btn btn-neutral btn-sm btn-outline font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary btn-sm font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              <button
                className="md:hidden btn btn-ghost btn-square"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <RiCloseLine size={24} />
                ) : (
                  <RiMenuLine size={24} />
                )}
              </button>
            </>
          )}
        </div>
      </div >

      {/* Mobile Menu */}
      {
        !isAuthenticated && mobileOpen && (
          <div className="md:hidden bg-base-100 border-t p-4 space-y-3 animate-slideDown">
            {publicLinks.map((l) => (
              <div key={l.name} className="flex items-center gap-2">
                <span className={`text-lg ${l.color}`}>{l.icon}</span>
                <Link
                  href={l.href}
                  className="block font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.name}
                </Link>
              </div>
            ))}
            <Link
              href="/login"
              className="btn btn-neutral btn-outline font-medium w-full"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-primary btn-outline font-medium w-full"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )
      }
    </nav >
  );
}

function ProfileDropdown({ currentUser, page, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const closeDropdown = () => setOpen(false);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="transition-transform hover:scale-105 focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Toggle user profile dropdown"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar
          src={page?.profile_image}
          alt={currentUser?.name}
          size="sm"
          ring={true}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-base-100 border rounded-xl shadow-lg z-50">
          <div className="flex items-center gap-3 p-4 bg-primary/5 border-b">
            <Avatar
              src={page?.profile_image}
              alt={currentUser?.name}
              size="md"
              ring={true}
            />
            <div className="flex-1">
              <p className="font-semibold">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email}
              </p>
              <span className="badge badge-primary badge-sm font-medium">
                {currentUser?.plan || "FREE"}
              </span>
            </div>
          </div>

          <ul className="py-2">
            <li>
              <Link
                href={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10"
                onClick={closeDropdown}
              >
                <RiLinksLine size={20} className="text-primary" />
                Dashboard
              </Link>
            </li>

            {currentUser?.role !== "admin" && (
              <li className="md:hidden">
                <button
                  onClick={() => {
                    if (page?.slug) {
                      window.open(`/${page.slug}`, "_blank");
                    } else {
                      toast.error("Slug not set");
                    }
                    closeDropdown();
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 w-full text-left"
                >
                  <RiExternalLinkLine size={20} className="text-secondary" />
                  <div>
                    Public Profile{" "}
                    <span className="text-sm">
                      ({page?.slug ? `/${page.slug}` : "not-set"})
                    </span>
                  </div>
                </button>
              </li>
            )}

            {publicLinks.map((l) => (
              <li key={l.name}>
                <Link
                  href={l.href}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10"
                  onClick={closeDropdown}
                >
                  <span className={l.color}>{l.icon}</span>
                  {l.name}
                </Link>
              </li>
            ))}

            <li className="mt-2 border-t">
              <button
                onClick={() => {
                  onLogout();
                  closeDropdown();
                }}
                className="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10 w-full text-left cursor-pointer"
              >
                <RiLogoutBoxRLine size={20} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
