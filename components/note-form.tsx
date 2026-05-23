"use client";

import { ccc } from "@ckb-ccc/connector-react";
import React, { useState, useMemo } from "react";

export function NoteForm() {
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { wallet } = ccc.useCcc();
    const signer = ccc.useSigner();

    // Convert string to hex for preview
    const hexPreview = useMemo(() => {
        if (!note) return "";
        try {
            return ccc.hexFrom(ccc.bytesFrom(note, "utf8"));
        } catch (e) {
            return "Error encoding note";
        }
    }, [note]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signer || !note) return;

        setIsSubmitting(true);
        setError(null);
        try {
            // 1. Create the note data bytes
            const noteBytes = ccc.bytesFrom(note, "utf8");

            // 2. Prepare the transaction
            // We'll create a new cell with the note data
            const lock = await signer.getRecommendedAddressObj();
            const outputData = ccc.hexFrom(noteBytes);

            // Calculate required capacity for the cell (data + lock + base capacity)
            const output = ccc.CellOutput.from({
                lock: lock.script,
            }, outputData);

            // 3. Complete the transaction (find inputs, handle change)
            const tx = ccc.Transaction.from({
                outputs: [output],
                outputsData: [outputData],
            });

            await tx.completeInputsByCapacity(signer);
            await tx.completeFeeBy(signer);

            // 4. Sign and send
            const txHash = await signer.sendTransaction(tx);

            alert(`Note stored successfully! Tx Hash: ${txHash}`);
            setNote("");
        } catch (error: any) {
            console.error("Storage error:", error);
            const message = error.message || String(error);

            if (message.toLowerCase().includes("insufficient capacity") || message.toLowerCase().includes("not enough")) {
                setError("Insufficient CKB capacity. You need more CKB to cover the byte-storage cost of this note.");
            } else {
                setError(`Failed to store note: ${message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden self-center">
            <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Write a Note</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Your note will be stored forever in the "Data" field of a CKB Cell.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="note" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Note Content
                        </label>
                        <textarea
                            id="note"
                            rows={4}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Enter something you want to preserve on-chain..."
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none font-sans text-zinc-900 dark:text-white"
                            required
                        />
                    </div>

                    {note && (
                        <div className="space-y-2 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Hex Representation</span>
                            <div className="font-mono text-xs break-all text-orange-600 dark:text-orange-400">
                                {hexPreview}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {!wallet ? (
                            <div className="text-center py-3 px-4 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 text-sm rounded-lg border border-orange-100 dark:border-orange-900/30">
                                Connect your wallet to store notes on-chain.
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting || !note}
                                className="w-full py-4 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing & Sending...
                                    </span>
                                ) : (
                                    "Store on CKB"
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium uppercase tracking-tight">
                    <span>Cell Model Logic</span>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://faucet.nervos.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600 transition-colors"
                        >
                            Get Testnet CKB (Faucet)
                        </a>
                        <span>Inputs → Outputs (w/ Data)</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mx-6 mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-red-700 dark:text-red-300">
                            {error}
                        </p>
                        {error.includes("Insufficient CKB") && (
                            <a
                                href="https://faucet.nervos.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-red-800 dark:text-red-200 underline hover:no-underline"
                            >
                                Visit CKB Testnet Faucet to get 300,000 CKB →
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
