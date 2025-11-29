import React from 'react';

function Logo({ className = "w-8 h-8" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className={className}
        >
            <rect width="200" height="200" rx="40" fill="#C9A05F" />

            <g fill="white"
                fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                dominantBaseline="alphabetic">

                <text x="88" y="120"
                    fontSize="36"
                    fontWeight="600"
                    textAnchor="end"
                    letterSpacing="-1">
                    Co
                </text>

                <text x="103" y="120"
                    fontSize="64"
                    fontWeight="700"
                    textAnchor="middle">
                    L
                </text>

                <text x="122" y="120"
                    fontSize="36"
                    fontWeight="600"
                    textAnchor="start"
                    letterSpacing="-1">
                    ab
                </text>
            </g>

            <text x="108" y="96"
                fontSize="28"
                fontWeight="500"
                fill="white"
                letterSpacing="-0.8"
                fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                textAnchor="start">
                ets
            </text>
        </svg>
    );
}

export default Logo;
