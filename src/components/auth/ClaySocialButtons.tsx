"use client";

import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";

const providers = [
  { name: "Google", Icon: FcGoogle, className: "clay-social-google" },
  { name: "Apple", Icon: FaApple, className: "clay-social-apple" },
  { name: "Facebook", Icon: FaFacebookF, className: "clay-social-facebook" },
];

export default function ClaySocialButtons({ action = "Login" }: { action?: string }) {
  return (
    <div className="clay-social-row">
      {providers.map(({ name, Icon, className }) => (
        <button
          key={name}
          type="button"
          aria-label={`${action} dengan ${name}`}
          className={`clay-social ${className}`}
          onClick={() => {
            if (name === "Google") {
              void signIn("google", { callbackUrl: "/dashboard" });
            } else {
              toast(`${action} dengan ${name} segera hadir`);
            }
          }}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}
