"use client";

import { ccc } from "@ckb-ccc/connector-react";
import React from "react";

export function WalletConnect() {
    const { wallet, open, disconnect } = ccc.useCcc();
    const signer = ccc.useSigner();
    const [address, setAddress] = React.useState<string>("");
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    React.useEffect(() => {
        if (signer) {
            signer.getRecommendedAddress().then(setAddress);
        } else {
            setAddress("");
        }
    }, [signer]);

    return (
        <div className="flex items-center gap-4">
            {wallet && address ? (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-zinc-500 font-mono">{wallet.name}</span>
                        <button
                            onClick={handleCopy}
                            className="text-sm font-medium text-zinc-900 dark:text-white font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2 group"
                            title="Click to copy full address"
                        >
                            {address.slice(0, 6)}...{address.slice(-4)}
                            {copied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => disconnect()}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => open()}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
