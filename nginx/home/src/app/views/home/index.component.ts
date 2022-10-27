import { Component } from '@angular/core';

// Services
import { AppRouterService } from 'src/app/services';

//Types
import { ApiSource, EndpointSource, ValidApiSources } from 'src/app/types';

@Component({
	selector: 'app-home-view',
	templateUrl: './index.component.html',
	styleUrls: ['../../../assets/styles/views/_home.scss'],
})
export class HomeViewComponent {
	public apiSources = ValidApiSources;
	public activeApiSource = ValidApiSources[0];
	public activeEndpointSource = ValidApiSources[0].endpoints[0];
	public activeEndpointSourceVariant: EndpointSource | null = null;
	public responseCode: string = `
{}
`;

	private _emptyCodeTemplate = `
{}
`;
	constructor(private router: AppRouterService) {}

	public onApiSourceClick(target: ApiSource): void {
		if (!ValidApiSources.find((apiSource) => apiSource.name === target.name)) {
			return;
		}

		this.activeApiSource = target;
		this.activeEndpointSource = this.activeApiSource.endpoints[0];
		this.activeEndpointSourceVariant = null;

		this.responseCode = this._emptyCodeTemplate;
	}

	public onApiEndpointSourceClick(target: EndpointSource): void {
		if (
			!this.activeApiSource.endpoints.find(
				(endpointSource) => endpointSource.name === target.name,
			)
		) {
			return;
		}

		this.activeEndpointSource = target;
		this.activeEndpointSourceVariant = null;

		this.responseCode = this._emptyCodeTemplate;
	}

	public onApiEndpointSourceVariantClick(target: EndpointSource): void {
		if (
			!this.activeEndpointSource ||
			!this.activeEndpointSource.variants ||
			!this.activeEndpointSource.variants.find(
				(endpointSourceVariant) => endpointSourceVariant.name === target.name,
			)
		) {
			return;
		}

		this.activeEndpointSourceVariant = target;

		this.responseCode = this._emptyCodeTemplate;
	}

	//TO-DO USE THE searchParam
	public generateCodeExample(): string {
		if (!this.activeApiSource || !this.activeEndpointSource) {
			return this._emptyCodeTemplate;
		}

		let fetchTemplate = `fetch('${this.activeApiSource.isSecure ? 'https' : 'http'}://${
			this.activeApiSource.rootUrl
		}/${this.activeApiSource.rootPath}/api/v${this.activeEndpointSource.version}/${
			this.activeEndpointSource.path
		}', {${this.getRequestParams(this.activeEndpointSource)}})`;

		if (this.activeEndpointSourceVariant) {
			fetchTemplate = `fetch('${this.activeApiSource.isSecure ? 'https' : 'http'}://${
				this.activeApiSource.rootUrl
			}/${this.activeApiSource.rootPath}/api/v${this.activeEndpointSourceVariant.version}/${
				this.activeEndpointSource.path
			}${this.activeEndpointSourceVariant.path}', {${this.getRequestParams(
				this.activeEndpointSourceVariant,
			)}})`;
		}

		return `
${fetchTemplate}
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
})
`;
	}

	//TO-DO USE THE searchParam
	public onFetchClick(): void {
		this.responseCode = this._emptyCodeTemplate;

		if (!this.activeApiSource || !this.activeEndpointSource) {
			return;
		}

		if (this.activeEndpointSourceVariant) {
			fetch(
				`http://localhost/${this.activeApiSource.rootPath}/api/v${this.activeEndpointSourceVariant.version}/${this.activeEndpointSource.path}${this.activeEndpointSourceVariant.path}`,
				{
					method: this.activeEndpointSourceVariant.method,
					body: this.activeEndpointSourceVariant.requestParams?.body,
					headers: this.activeEndpointSourceVariant.requestParams?.headers,
				},
			)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					this.responseCode = '\n' + JSON.stringify(data, null, '   ');
				})
				.catch((error) => {
					this.responseCode =
						'\n' +
						JSON.stringify({ wasSuccess: false, error: error.message }, null, '   ');
				});
		} else {
			fetch(
				`http://localhost/${this.activeApiSource.rootPath}/api/v${this.activeEndpointSource.version}/${this.activeEndpointSource.path}`,
				{
					method: this.activeEndpointSource.method,
					body: this.activeEndpointSource.requestParams?.body,
					headers: this.activeEndpointSource.requestParams?.headers,
				},
			)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					this.responseCode = '\n' + JSON.stringify(data, null, '   ');
				})
				.catch((error) => {
					this.responseCode =
						'\n' +
						JSON.stringify({ wasSuccess: false, error: error.message }, null, '   ');
				});
		}
	}

	public logoOnClick(): void {
		this.router.navigateTo('/');
	}

	public loginOnClick(): void {
		this.router.navigateTo('dashboard');
	}

	private getRequestParams(target: EndpointSource): string {
		let body = `body: {`;
		let headers = `headers: {`;

		const bodyTextDefaultSize = body.length;
		const headersTextDefaultSize = headers.length;

		if (target?.requestParams?.body) {
			for (const [key, value] of Object.entries(target?.requestParams?.body)) {
				body += `
		${key}: '${value}',`;
			}
		}

		body +=
			body.length > bodyTextDefaultSize
				? `
	},`
				: '}';

		if (target?.requestParams?.headers) {
			target?.requestParams?.headers?.forEach((value, key) => {
				headers += `
		${key}: '${value}',
`;
			});
		}

		headers +=
			headers.length > headersTextDefaultSize
				? `
	},`
				: '}';

		let result = `
	${`method: '${target.method}'`},`;

		if (headers.length > headersTextDefaultSize + 1) {
			result += `
	${headers}`;
		}

		if (body.length > bodyTextDefaultSize + 1) {
			result += `
	${body}`;
		}

		result += `
`;
		return result;
	}
}