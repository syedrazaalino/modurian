/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Modurian. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

/**
 * Thin client for Modurian backend. Extend with streaming chat and tools later.
 */
export class ModurianSession {
	constructor(private readonly baseUrl: string) { }

	getBaseUrl(): string {
		return this.baseUrl;
	}

	async ping(): Promise<{ ok: boolean; status: number; body: string }> {
		const url = `${this.baseUrl}/api/modurian/ping`;
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: '{}',
		});
		const body = await res.text();
		return { ok: res.ok, status: res.status, body };
	}

	/** Placeholder for agent chat + tools (SSE/streaming to be added). */
	async sendChat(_message: string): Promise<never> {
		throw new Error('Modurian agent chat is not implemented yet.');
	}
}
