/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Modurian. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ModurianSession } from './session';

function normalizeBaseUrl(raw: string): string {
	return raw.trim().replace(/\/+$/, '');
}

function readBaseUrl(): string {
	const cfg = vscode.workspace.getConfiguration('modurian');
	const v = cfg.get<string>('apiUrl', 'https://modurian.com');
	return normalizeBaseUrl(v);
}

export function activate(context: vscode.ExtensionContext): void {
	const changed = new vscode.EventEmitter<void>();
	context.subscriptions.push(changed);
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('modurian')) {
				changed.fire();
			}
		}),
	);

	const provider = new ModurianTreeProvider(changed.event);
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('modurian.sidebar', provider),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('modurian.refresh', () => changed.fire()),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('modurian.ping', async () => {
			const base = readBaseUrl();
			const session = new ModurianSession(base);
			try {
				const r = await session.ping();
				if (r.ok) {
					await vscode.window.showInformationMessage(`Modurian API: ${r.status} — ${r.body.slice(0, 400)}`);
				} else {
					await vscode.window.showWarningMessage(`Modurian API: ${r.status} — ${r.body.slice(0, 400)}`);
				}
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				await vscode.window.showErrorMessage(`Modurian ping failed: ${msg}`);
			}
		}),
	);
}

class ModurianTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private readonly onDidChangeTreeDataEmitter = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
	readonly onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

	constructor(onConfig: vscode.Event<void>) {
		onConfig(() => this.onDidChangeTreeDataEmitter.fire());
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(): vscode.ProviderResult<vscode.TreeItem[]> {
		const base = readBaseUrl();
		const urlItem = new vscode.TreeItem(`API: ${base}`);
		urlItem.description = 'modurian.apiUrl';
		urlItem.iconPath = new vscode.ThemeIcon('globe');

		const ping = new vscode.TreeItem('Ping Modurian API');
		ping.iconPath = new vscode.ThemeIcon('radio-tower');
		ping.command = {
			command: 'modurian.ping',
			title: 'Ping Modurian API',
		};

		const hint = new vscode.TreeItem('Implement POST /api/modurian/ping on your server');
		hint.description = 'returns JSON or text';
		hint.iconPath = new vscode.ThemeIcon('info');

		return [urlItem, ping, hint];
	}
}
