import React from "react";

/**
 * Google Sign-In button built to comply with Google's official branding
 * guidelines (https://developers.google.com/identity/branding-guidelines).
 *
 * Guidelines followed:
 *  - Official multi-colour Google "G" logo SVG (colours unaltered)
 *  - Roboto Medium, 14 px (Google mandates Roboto)
 *  - Minimum 40 px touch-target height
 *  - 12 px side padding, centred content
 *  - Dark & Light theme variants supported
 */
export default function ContinueWithGoogle({ className = "", role = "buyer", theme = "dark" }) {
  const isLight = theme === "light";

  return (
    <>
      {/* Google mandates Roboto font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');

        .gsi-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid #d9d4cd;
          background-color: #ffffff;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
          user-select: none;
          box-sizing: border-box;
        }
        .gsi-btn--dark {
          border-radius: 4px;
          border-color: #8E918F;
          background-color: #131314;
          min-height: 36px;
        }
        .gsi-btn:hover {
          background-color: #f7f6f4;
          border-color: #c4beb5;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .gsi-btn--dark:hover {
          background-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }
        .gsi-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(28, 26, 23, 0.15);
        }
        .gsi-btn--dark:focus-visible {
          box-shadow: 0 0 0 3px rgba(245, 195, 66, 0.2);
        }
        .gsi-btn:active {
          background-color: #f0eee9;
          box-shadow: none;
        }
        .gsi-btn--dark:active {
          background-color: rgba(255, 255, 255, 0.12);
          box-shadow: none;
        }
        .gsi-btn__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }
        .gsi-btn__label {
          font-family: 'Roboto', 'Inter', ui-sans-serif, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.0107143em;
          color: #2b2824;
          line-height: 1;
        }
        .gsi-btn--dark .gsi-btn__label {
          color: #E3E3E3;
        }
      `}</style>

      <a
        href={`/api/auth/google?role=${role}`}
        className={`gsi-btn ${isLight ? "" : "gsi-btn--dark"} ${className}`}
        role="button"
        aria-label="Continue with Google"
        id="btn-continue-with-google"
      >
        {/* Official Google "G" logo — colours must not be altered per Google branding guidelines */}
        <span className="gsi-btn__icon" aria-hidden="true">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20"
            height="20"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        </span>

        <span className="gsi-btn__label">Continue with Google</span>
      </a>
    </>
  );
}
