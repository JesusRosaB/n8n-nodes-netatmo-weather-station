import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Netatmo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Netatmo',
		name: 'netatmo',
		icon: 'file:../icons/netatmo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get data from Netatmo Weather Station',
		defaults: {
			name: 'Netatmo',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'netatmoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Station Data',
						value: 'getStationData',
						description: 'Get data from a Weather Station',
						action: 'Get station data',
					},
				],
				default: 'getStationData',
			},
			{
				displayName: 'Device ID',
				name: 'deviceId',
				type: 'string',
				default: '',
				placeholder: '70:ee:50:xx:xx:xx',
				description: 'The device ID of your Netatmo station (leave empty to get all devices)',
				displayOptions: {
					show: {
						operation: ['getStationData'],
					},
				},
			},
			{
				displayName: 'Get Favorites',
				name: 'getFavorites',
				type: 'boolean',
				default: false,
				description: 'Whether to retrieve favorite stations',
				displayOptions: {
					show: {
						operation: ['getStationData'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'getStationData') {
					// Obtener credenciales
					const credentials = await this.getCredentials('netatmoApi', i);
					
					const deviceId = this.getNodeParameter('deviceId', i, '') as string;
					const getFavorites = this.getNodeParameter('getFavorites', i, false) as boolean;

					// Primero, refrescar el token de acceso
					const tokenResponse = await this.helpers.request({
						method: 'POST',
						url: 'https://api.netatmo.com/oauth2/token',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(credentials.refreshToken as string)}&client_id=${credentials.clientId}&client_secret=${credentials.clientSecret}`,
					});

					const accessToken = JSON.parse(tokenResponse).access_token;

					// Construir los parámetros de la consulta
					const queryParams: any = {
						get_favorites: getFavorites,
					};

					if (deviceId) {
						queryParams.device_id = deviceId;
					}

					// Obtener datos de la estación
					const stationData = await this.helpers.request({
						method: 'GET',
						url: 'https://api.netatmo.com/api/getstationsdata',
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'Accept': 'application/json',
						},
						qs: queryParams,
						json: true,
					});

					returnData.push({
						json: stationData.body || stationData,
						pairedItem: i,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: i,
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
			}
		}

		return [returnData];
	}
}