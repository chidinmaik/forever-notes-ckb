"use client";

import { ccc } from "@ckb-ccc/connector-react";
import React, { useEffect, useState, useCallback } from "react";

interface Note {
    txHash: string;
    index: string;
    content: string;
    capacity: string;
}

export function NoteList() {
    const { wallet } = ccc.useCcc();
    const signer = ccc.useSigner();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotes = useCallback(async () => {
        if (!signer) return;
        setIsLoading(true);
        try {
            const lockAddress = await signer.getRecommendedAddressObj();

            const foundNotes: Note[] = [];
            // Search for cells with data using the signer's client
            // findCells returns an async generator
            for await (const cell of signer.client.findCells({
                script: lockAddress.script,
                scriptType: "lock",
                scriptSearchMode: "prefix",
                withData: true,
            })) {
                if (cell.outputData && cell.outputData !== "0x") {
                    try {
                        const content = ccc.bytesTo(ccc.bytesFrom(cell.outputData), "utf8");
                        foundNotes.push({
                            txHash: cell.outPoint.txHash,
                            index: cell.outPoint.index.toString(),
                            content,
                            capacity: ccc.fixedPointToString(cell.cellOutput.capacity),
                        });
                    } catch (e) {
                        // Probably not a UTF-8 string, skip
                    }
                }
            }
            setNotes(foundNotes);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [signer]);

    useEffect(() => {
        if (wallet) {
            fetchNotes();
        } else {
            setNotes([]);
        }
    }, [wallet, fetchNotes]);

    if (!wallet) return null;

    return (
        <div className="w-full max-w-2xl space-y-6 self-center pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Your On-chain Notes
                    {isLoading && (
                        <svg className="animate-spin h-4 w-4 text-zinc-400" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                </h2>
                <button
                    onClick={fetchNotes}
                    disabled={isLoading}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <p className="text-zinc-500 text-sm">No notes found for this address.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {notes.map((note) => (
                        <div
                            key={`${note.txHash}-${note.index}`}
                            className="group p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-orange-500"
                        >
                            <div className="space-y-3">
                                <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                                    {note.content}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-zinc-400 font-mono">
                                    <span className="bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded">
                                        Capacity: {note.capacity} CKB
                                    </span>
                                    <a
                                        href={`https://explorer.nervos.org/transaction/${note.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-orange-500 transition-colors"
                                    >
                                        TX: {note.txHash.slice(0, 10)}...
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
